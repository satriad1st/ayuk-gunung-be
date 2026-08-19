import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminRole } from '../../common/constants/admin-roles';
import { AdminService } from './admin.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const existing = await this.adminService.countByRole(AdminRole.SUPERADMIN);
    if (existing > 0) {
      return;
    }

    const email = this.configService.get<string>('superadmin.email');
    const password = this.configService.get<string>('superadmin.password');
    const name =
      this.configService.get<string>('superadmin.name') ?? 'Super Admin';

    if (!email || !password) {
      this.logger.warn(
        'No superadmin found and SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD are not set. Skip seeding.',
      );
      return;
    }

    await this.adminService.create({
      name,
      email,
      password,
      role: AdminRole.SUPERADMIN,
    });

    this.logger.log(`Seeded superadmin account: ${email}`);
  }
}
