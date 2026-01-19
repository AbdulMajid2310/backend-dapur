import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }
    return null;
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies.refresh_token;

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
