import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class QueryCityDto {
  @ApiProperty({ example: '66b0c2f1a1b2c3d4e5f60789' })
  @IsMongoId()
  provinceId: string;
}
