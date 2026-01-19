import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  baseUrl: process.env.BASE_URL || 'http://localhost:8080',
  port: parseInt(process.env.PORT ?? '3000', 10),
}));
