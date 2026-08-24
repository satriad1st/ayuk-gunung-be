import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null | undefined;

  constructor(private readonly configService: ConfigService) {}

  isConfigured() {
    return Boolean(this.getTransporter());
  }

  async sendVerificationCode(email: string, name: string, code: string) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#0b1f3a">
        <h1 style="font-size:20px">Kode verifikasi Ayuk Gunung</h1>
        <p>Halo ${this.escape(name)},</p>
        <p>Masukkan kode ini untuk menyelesaikan pendaftaran akunmu:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;margin:24px 0">${code}</p>
        <p>Kode berlaku 15 menit. Abaikan email ini jika kamu tidak mendaftar.</p>
      </div>
    `;

    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `Mail is not configured. Verification code for ${email}: ${code}`,
      );
      return;
    }

    await transporter.sendMail({
      from:
        this.configService.get<string>('mail.from') ??
        '"Ayuk Gunung" <noreply@ayukgunung.com>',
      to: email,
      subject: `${code} adalah kode verifikasi Ayuk Gunung`,
      text: `Halo ${name}, kode verifikasi kamu: ${code}. Berlaku 15 menit.`,
      html,
    });
  }

  private getTransporter() {
    if (this.transporter !== undefined) {
      return this.transporter;
    }

    const host = this.configService.get<string>('mail.host');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.password');

    if (!host || !user || !pass) {
      this.transporter = null;
      return this.transporter;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: this.configService.get<number>('mail.port') ?? 587,
      secure: this.configService.get<boolean>('mail.secure') ?? false,
      auth: { user, pass },
    });

    return this.transporter;
  }

  private escape(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
