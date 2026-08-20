export enum Permission {
  DASHBOARD_READ = 'dashboard:read',

  ADMIN_READ = 'admin:read',
  ADMIN_CREATE = 'admin:create',
  ADMIN_UPDATE = 'admin:update',
  ADMIN_DELETE = 'admin:delete',
  ADMIN_BAN = 'admin:ban',

  MOUNTAIN_READ = 'mountain:read',
  MOUNTAIN_CREATE = 'mountain:create',
  MOUNTAIN_UPDATE = 'mountain:update',
  MOUNTAIN_DELETE = 'mountain:delete',

  BASECAMP_READ = 'basecamp:read',
  BASECAMP_CREATE = 'basecamp:create',
  BASECAMP_UPDATE = 'basecamp:update',
  BASECAMP_DELETE = 'basecamp:delete',

  HOMESTAY_READ = 'homestay:read',
  HOMESTAY_CREATE = 'homestay:create',
  HOMESTAY_UPDATE = 'homestay:update',
  HOMESTAY_DELETE = 'homestay:delete',

  PRIVATE_TRIP_READ = 'private_trip:read',
  PRIVATE_TRIP_UPDATE = 'private_trip:update',
}

export const ALL_PERMISSIONS = Object.values(Permission);
