// src/auth/strategies/jwt-cookie.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(private configService: ConfigService) {
    super({
      // Perubahan kunci: Ekstrak token dari cookie, bukan dari header
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtCookieStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(payload: any) {
    // Payload yang dikembalikan akan tersedia di req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}