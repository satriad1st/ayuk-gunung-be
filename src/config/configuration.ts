export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN,
  superadmin: {
    name: process.env.SUPERADMIN_NAME ?? 'Super Admin',
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASSWORD,
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
  },
  appUrl: process.env.APP_URL ?? 'http://localhost:3000',
});
