import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrivateTripService } from './private-trip.service';

@Injectable()
export class PrivateTripSeedService implements OnModuleInit {
  private readonly logger = new Logger(PrivateTripSeedService.name);

  constructor(private readonly privateTripService: PrivateTripService) {}

  async onModuleInit() {
    await this.privateTripService.ensureDocument();
    this.logger.log('Private trip landing content is ready');
  }
}
