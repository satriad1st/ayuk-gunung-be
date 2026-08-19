import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Service health check' })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        service: 'ayuk-gunung-be',
        timestamp: '2026-08-15T04:00:00.000Z',
      },
    },
  })
  check() {
    return {
      status: 'ok',
      service: 'ayuk-gunung-be',
      timestamp: new Date().toISOString(),
    };
  }
}
