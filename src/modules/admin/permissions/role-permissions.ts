import { AdminRole } from '../../../common/constants/admin-roles';
import {
  ALL_PERMISSIONS,
  Permission,
} from '../../../common/constants/permissions';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPERADMIN]: ALL_PERMISSIONS,
  [AdminRole.ADMIN]: [
    Permission.DASHBOARD_READ,
    Permission.MOUNTAIN_READ,
    Permission.MOUNTAIN_CREATE,
    Permission.MOUNTAIN_UPDATE,
    Permission.MOUNTAIN_DELETE,
    Permission.BASECAMP_READ,
    Permission.BASECAMP_CREATE,
    Permission.BASECAMP_UPDATE,
    Permission.BASECAMP_DELETE,
    Permission.HOMESTAY_READ,
    Permission.HOMESTAY_CREATE,
    Permission.HOMESTAY_UPDATE,
    Permission.HOMESTAY_DELETE,
    Permission.PRIVATE_TRIP_READ,
    Permission.PRIVATE_TRIP_UPDATE,
    Permission.PRIVATE_TRIP_BOOKING_CREATE,
    Permission.PRIVATE_TRIP_BOOKING_UPDATE,
    Permission.PRIVATE_TRIP_BOOKING_DELETE,
  ],
  [AdminRole.ADMIN_HOMESTAY]: [
    Permission.DASHBOARD_READ,
    Permission.HOMESTAY_READ,
    Permission.HOMESTAY_CREATE,
    Permission.HOMESTAY_UPDATE,
    Permission.HOMESTAY_DELETE,
  ],
};

export function getPermissionsForRole(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: AdminRole, required: Permission): boolean {
  if (role === AdminRole.SUPERADMIN) {
    return true;
  }

  return ROLE_PERMISSIONS[role].includes(required);
}
