import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/constants/roles';

export class UserResponseDto {
  @ApiProperty({ example: '66b0c2f1a1b2c3d4e5f60789' })
  id: string;

  @ApiProperty({ example: 'budi@example.com' })
  email: string;

  @ApiProperty({ example: 'Budi Santoso' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ example: '7d' })
  expiresIn: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
