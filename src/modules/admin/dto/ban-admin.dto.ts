import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class BanAdminDto {
  @ApiProperty({
    example: 'Melanggar ketentuan: menampilkan harga palsu di listing homestay',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}
