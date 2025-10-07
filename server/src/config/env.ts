import 'dotenv/config';

const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173'
};
