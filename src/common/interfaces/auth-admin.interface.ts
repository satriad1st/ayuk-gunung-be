import { AdminRole, AdminStatus } from '../constants/admin-roles';
import { Permission } from '../constants/permissions';

export interface AdminAuthUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  permissions: Permission[];
}

export interface AdminJwtPayload {
  sub: string;
  email: string;
  role: AdminRole;
  tokenType: 'admin';
}
