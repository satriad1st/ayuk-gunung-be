import { AdminRole } from '../../../common/constants/admin-roles';
import { Permission } from '../../../common/constants/permissions';
import { hasPermission } from './role-permissions';

export interface AdminMenu {
  key: string;
  label: string;
  path: string;
  permission: Permission;
  children?: AdminMenu[];
}

export const ADMIN_MENUS: AdminMenu[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    permission: Permission.DASHBOARD_READ,
  },
  {
    key: 'mountains',
    label: 'Gunung',
    path: '/mountains',
    permission: Permission.MOUNTAIN_READ,
  },
  {
    key: 'basecamps',
    label: 'Basecamp',
    path: '/basecamps',
    permission: Permission.BASECAMP_READ,
  },
  {
    key: 'homestays',
    label: 'Homestay',
    path: '/homestays',
    permission: Permission.HOMESTAY_READ,
  },
  {
    key: 'private-trip',
    label: 'Private Trip',
    path: '/private-trip',
    permission: Permission.PRIVATE_TRIP_READ,
    children: [
      {
        key: 'private-trip-schedule',
        label: 'Jadwal Trip',
        path: '/private-trip/jadwal',
        permission: Permission.PRIVATE_TRIP_READ,
      },
      {
        key: 'private-trip-settings',
        label: 'Setting',
        path: '/private-trip/settings',
        permission: Permission.PRIVATE_TRIP_READ,
      },
    ],
  },
  {
    key: 'admins',
    label: 'Manajemen Admin',
    path: '/admins',
    permission: Permission.ADMIN_READ,
  },
  {
    key: 'account',
    label: 'Ganti Password',
    path: '/account',
    permission: Permission.DASHBOARD_READ,
  },
];

export function getMenusForRole(role: AdminRole): AdminMenu[] {
  return ADMIN_MENUS.filter((menu) =>
    hasPermission(role, menu.permission),
  ).map((menu) => ({
    ...menu,
    children: menu.children?.filter((child) =>
      hasPermission(role, child.permission),
    ),
  }));
}
