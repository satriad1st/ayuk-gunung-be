import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'budi@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '482193' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Kode verifikasi harus 6 digit' })
  code: string;
}
