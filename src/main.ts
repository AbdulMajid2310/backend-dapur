import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ KONFIGURASI HELMET YANG BENAR (KUNCI SOLUSI)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // <-- PENTING
    })
  );

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ CORS (cukup di sini)
  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,               // 🔥 PENTING
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',],
});


  // ✅ Serve folder uploads + header yang tepat
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads'), {
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      },
    }),
  );

  await app.listen(process.env.PORT || 7000);
}

bootstrap();
