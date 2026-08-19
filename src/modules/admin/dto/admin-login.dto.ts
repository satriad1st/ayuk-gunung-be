import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'superadmin@ayukgunung.id' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Superadmin123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
