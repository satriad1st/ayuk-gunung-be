import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { MongoServerError } from 'mongodb';
import { Types } from 'mongoose';
import { randomInt } from 'node:crypto';
import {
  AuthUser,
  JwtPayload,
} from '../../common/interfaces/auth-user.interface';
import { MailService } from '../mail/mail.service';
import { RegionsService } from '../regions/regions.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

const SALT_ROUNDS = 12;
const CODE_TTL_MS = 15 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly regionsService: RegionsService,
    private readonly storageService: LocalStorageService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.usersService.findByEmailWithSecrets(email);

    if (existing?.isActive === false) {
      throw new ForbiddenException(
        'Akun ini diblokir karena melanggar ketentuan. Hubungi admin jika ini kekeliruan.',
      );
    }

    if (existing?.emailVerified) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const profile = await this.profileFromDto(dto);

    try {
      if (existing) {
        existing.name = dto.name;
        existing.phone = dto.phone;
        existing.password = hashedPassword;
        Object.assign(existing, profile);
        await existing.save();
        const code = await this.issueVerificationCode(existing);
        return this.pendingResponse(email, code);
      }

      const user = await this.usersService.create({
        name: dto.name,
        email,
        phone: dto.phone,
        password: hashedPassword,
        emailVerified: false,
        isActive: true,
        ...profile,
      });
      const code = await this.issueVerificationCode(user);
      return this.pendingResponse(email, code);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw error;
    }
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithSecrets(dto.email);

    if (!user) {
      throw new BadRequestException('Kode verifikasi tidak valid');
    }

    this.assertNotBanned(user);

    if (user.emailVerified) {
      return this.buildAuthResponse(user);
    }

    if (
      !user.emailVerificationCodeHash ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'Kode verifikasi kedaluwarsa. Kirim ulang kode baru.',
      );
    }

    const matches = await bcrypt.compare(
      dto.code,
      user.emailVerificationCodeHash,
    );
    if (!matches) {
      throw new BadRequestException('Kode verifikasi tidak valid');
    }

    user.emailVerified = true;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return this.buildAuthResponse(user);
  }

  async resendCode(email: string) {
    const user = await this.usersService.findByEmailWithSecrets(email);

    if (!user) {
      return this.pendingResponse(email.toLowerCase());
    }

    this.assertNotBanned(user);

    if (user.emailVerified) {
      throw new BadRequestException('Email sudah diverifikasi. Silakan masuk.');
    }

    if (
      user.emailVerificationSentAt &&
      Date.now() - user.emailVerificationSentAt.getTime() < RESEND_COOLDOWN_MS
    ) {
      throw new BadRequestException(
        'Tunggu sebentar sebelum mengirim ulang kode.',
      );
    }

    const code = await this.issueVerificationCode(user);
    return this.pendingResponse(user.email, code);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithSecrets(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email atau kata sandi salah');
    }

    this.assertNotBanned(user);

    if (!user.password) {
      throw new UnauthorizedException(
        'Akun ini terdaftar lewat Google. Masuk dengan Google, atau atur kata sandi nanti.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau kata sandi salah');
    }

    if (user.emailVerified === false) {
      throw new ForbiddenException(
        'Email belum diverifikasi. Cek inbox untuk kode verifikasi.',
      );
    }

    return this.buildAuthResponse(user);
  }

  async loginWithGoogle(idToken: string): Promise<AuthResponseDto> {
    const clientId = this.configService.get<string>('google.clientId');
    if (!clientId) {
      throw new BadRequestException('Login Google belum dikonfigurasi');
    }

    const client = new OAuth2Client(clientId);
    let email = '';
    let name = '';
    let googleId = '';
    let picture = '';

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.email || !payload.sub) {
        throw new UnauthorizedException('Akun Google tidak valid');
      }
      email = payload.email.toLowerCase();
      name = payload.name?.trim() || email.split('@')[0];
      googleId = payload.sub;
      picture = payload.picture ?? '';
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token Google tidak valid');
    }

    let user =
      (await this.usersService.findByGoogleId(googleId)) ??
      (await this.usersService.findByEmail(email));

    if (user) {
      this.assertNotBanned(user);
      user.googleId = googleId;
      user.emailVerified = true;
      const storedPicture = await this.storeGoogleAvatar(picture);
      if (storedPicture && this.shouldReplaceGoogleAvatar(user.avatarUrl)) {
        if (user.avatarUrl?.startsWith('/uploads/')) {
          await this.storageService.remove(user.avatarUrl);
        }
        user.avatarUrl = storedPicture;
      } else if (!user.avatarUrl && storedPicture) {
        user.avatarUrl = storedPicture;
      }
      await user.save();
      return this.buildAuthResponse(user);
    }

    const storedPicture = await this.storeGoogleAvatar(picture);
    user = await this.usersService.create({
      name,
      email,
      googleId,
      emailVerified: true,
      isActive: true,
      avatarUrl: storedPicture || picture || undefined,
    });

    return this.buildAuthResponse(user);
  }

  async me(authUser: AuthUser) {
    const user = await this.usersService.findById(authUser.id);
    if (!user) {
      throw new UnauthorizedException('Sesi tidak valid');
    }
    this.assertNotBanned(user);
    if (this.isGoogleHostedAvatar(user.avatarUrl)) {
      void this.persistGoogleAvatarForUser(
        String(user._id),
        user.avatarUrl as string,
      );
    }
    return this.usersService.toProfile(user);
  }

  async updateProfile(authUser: AuthUser, dto: UpdateProfileDto) {
    const user = await this.usersService.findDocument(authUser.id);
    this.assertNotBanned(user);

    const cityId = dto.cityId ?? undefined;
    const provinceId = dto.provinceId ?? undefined;

    if (cityId && !provinceId) {
      throw new BadRequestException('Pilih provinsi sebelum kota/kabupaten');
    }

    if (provinceId) {
      await this.regionsService.getProvince(provinceId);
    }

    if (cityId && provinceId) {
      await this.regionsService.getCityInProvince(cityId, provinceId);
    }

    user.name = dto.name;
    user.phone = dto.phone?.trim() || undefined;
    user.birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
    user.bloodType = dto.bloodType || undefined;
    user.province = provinceId ? new Types.ObjectId(provinceId) : undefined;
    user.city = cityId ? new Types.ObjectId(cityId) : undefined;
    user.address = dto.address?.trim() || undefined;
    user.latitude = dto.latitude ?? undefined;
    user.longitude = dto.longitude ?? undefined;
    await user.save();

    const populated = await this.usersService.findById(user._id.toString());
    return this.usersService.toProfile(populated ?? user);
  }

  async changePassword(authUser: AuthUser, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Konfirmasi kata sandi tidak sama');
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException(
        'Kata sandi baru harus berbeda dari yang sekarang',
      );
    }

    const user = await this.usersService.findByIdWithSecrets(authUser.id);
    if (!user) {
      throw new UnauthorizedException('Sesi tidak valid');
    }
    this.assertNotBanned(user);

    if (!user.password) {
      throw new BadRequestException(
        'Akun Google tidak memiliki kata sandi. Masuk tetap memakai Google.',
      );
    }

    const matches = await bcrypt.compare(dto.currentPassword, user.password);
    if (!matches) {
      throw new BadRequestException('Kata sandi saat ini salah');
    }

    user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await user.save();
  }

  async saveAvatar(authUser: AuthUser, file: Express.Multer.File) {
    const user = await this.usersService.findDocument(authUser.id);
    this.assertNotBanned(user);

    const uploaded = await this.storageService.save(file, 'users');
    const previous = user.avatarUrl;
    user.avatarUrl = uploaded.url;
    await user.save();

    if (previous?.startsWith('/uploads/')) {
      await this.storageService.remove(previous);
    }

    return this.usersService.toProfile(user);
  }

  private async profileFromDto(dto: RegisterDto) {
    if (dto.cityId && !dto.provinceId) {
      throw new BadRequestException('Pilih provinsi sebelum kota/kabupaten');
    }

    if (dto.provinceId) {
      await this.regionsService.getProvince(dto.provinceId);
    }

    if (dto.cityId && dto.provinceId) {
      await this.regionsService.getCityInProvince(dto.cityId, dto.provinceId);
    }

    return {
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      bloodType: dto.bloodType,
      province: dto.provinceId
        ? new Types.ObjectId(dto.provinceId)
        : undefined,
      city: dto.cityId ? new Types.ObjectId(dto.cityId) : undefined,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
  }

  private isGoogleHostedAvatar(avatarUrl?: string) {
    if (!avatarUrl) {
      return false;
    }
    return (
      avatarUrl.includes('googleusercontent.com') ||
      avatarUrl.includes('ggpht.com')
    );
  }

  private shouldReplaceGoogleAvatar(avatarUrl?: string) {
    if (!avatarUrl) {
      return true;
    }
    return this.isGoogleHostedAvatar(avatarUrl);
  }

  private async persistGoogleAvatarForUser(userId: string, pictureUrl: string) {
    try {
      const stored = await this.storeGoogleAvatar(pictureUrl);
      if (!stored) {
        return;
      }
      const user = await this.usersService.findDocument(userId);
      if (!this.isGoogleHostedAvatar(user.avatarUrl)) {
        return;
      }
      user.avatarUrl = stored;
      await user.save();
    } catch (error) {
      this.logger.warn(
        `Gagal menyimpan foto Google untuk ${userId}: ${String(error)}`,
      );
    }
  }

  private async storeGoogleAvatar(pictureUrl?: string) {
    if (!pictureUrl) {
      return undefined;
    }

    let parsed: URL;
    try {
      parsed = new URL(pictureUrl);
    } catch {
      return undefined;
    }

    const host = parsed.hostname.toLowerCase();
    const allowed =
      host.endsWith('googleusercontent.com') || host.endsWith('ggpht.com');
    if (parsed.protocol !== 'https:' || !allowed) {
      return undefined;
    }

    const downloadUrl = pictureUrl.replace(/=s\d+(?:-[a-z0-9]+)*$/i, '=s256-c');

    try {
      const response = await fetch(downloadUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: 'image/*',
          'User-Agent': 'Mozilla/5.0 (compatible; AyukGunung/1.0)',
        },
        redirect: 'follow',
      });
      if (!response.ok) {
        this.logger.warn(
          `Unduhan foto Google gagal (${response.status}) ${host}`,
        );
        return undefined;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length < 32 || buffer.length > 2 * 1024 * 1024) {
        return undefined;
      }

      const contentType = (
        response.headers.get('content-type') ?? 'image/jpeg'
      )
        .split(';')[0]
        .trim();
      const extension =
        contentType === 'image/png'
          ? '.png'
          : contentType === 'image/webp'
            ? '.webp'
            : '.jpg';

      const saved = await this.storageService.save(
        {
          buffer,
          originalname: `google-avatar${extension}`,
          mimetype: contentType.startsWith('image/')
            ? contentType
            : 'image/jpeg',
          size: buffer.length,
        } as Express.Multer.File,
        'users',
      );
      return saved.url;
    } catch (error) {
      this.logger.warn(`Unduhan foto Google error: ${String(error)}`);
      return undefined;
    }
  }

  private async issueVerificationCode(user: UserDocument) {
    const code = String(randomInt(100000, 1000000));
    user.emailVerificationCodeHash = await bcrypt.hash(code, SALT_ROUNDS);
    user.emailVerificationExpires = new Date(Date.now() + CODE_TTL_MS);
    user.emailVerificationSentAt = new Date();
    await user.save();
    await this.mailService.sendVerificationCode(user.email, user.name, code);
    return code;
  }

  private assertNotBanned(user: UserDocument) {
    if (user.isActive === false) {
      throw new ForbiddenException(
        user.bannedReason
          ? `Akun diblokir: ${user.bannedReason}`
          : 'Akun kamu diblokir karena melanggar ketentuan.',
      );
    }
  }

  private pendingResponse(email: string, code?: string) {
    const allowDebug =
      !this.mailService.isConfigured() &&
      this.configService.get<string>('nodeEnv') !== 'production';

    return {
      message: 'Kode verifikasi sudah dikirim ke email',
      email,
      ...(allowDebug && code ? { debugCode: code } : {}),
    };
  }

  private async buildAuthResponse(
    user: UserDocument,
  ): Promise<AuthResponseDto> {
    const populated =
      (await this.usersService.findById(user._id.toString())) ?? user;
    const profile = this.usersService.toProfile(populated);
    const payload: JwtPayload = {
      sub: profile.id,
      email: profile.email,
      role: profile.role,
      tokenType: 'user',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('jwt.expiresIn') ?? '7d',
      user: profile,
    };
  }
}
