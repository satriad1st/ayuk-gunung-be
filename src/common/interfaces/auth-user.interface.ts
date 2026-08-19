import { UserRole } from '../constants/roles';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenType?: 'user' | 'admin';
}
