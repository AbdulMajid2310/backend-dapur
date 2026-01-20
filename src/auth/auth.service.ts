import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private parseJwtExpiration(
    value: string | undefined,
    defaultSeconds: number,
  ): number {
    if (!value) return defaultSeconds;

    if (!isNaN(Number(value))) {
      return Number(value);
    }

    const unit = value.slice(-1);
    const amount = Number(value.slice(0, -1));

    if (isNaN(amount)) {
      throw new Error(`Invalid JWT expiration format: ${value}`);
    }

    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 60 * 60;
      case 'd':
        return amount * 60 * 60 * 24;
      default:
        throw new Error(`Invalid JWT expiration unit in: ${value}`);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
  const user = await this.usersService.findOneByEmail(email);

  if (!user) {
    // Jika email tidak ditemukan
    throw new UnauthorizedException('Email atau password salah');
  }

  const passwordMatches = await bcrypt.compare(pass, user.password);
  if (!passwordMatches) {
    // Jika password tidak cocok
    throw new UnauthorizedException('Email atau password salah');
  }

  // Jika valid, kembalikan user tanpa password
  const { password, ...result } = user;
  return result;
}


  async login(user: User) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined in .env file',
      );
    }

    const jwtExpiration = this.parseJwtExpiration(
      this.configService.get<string>('JWT_EXPIRATION'),
      15 * 60,
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiration,
    });

    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtRefreshSecret) {
      throw new InternalServerErrorException(
        'JWT_REFRESH_SECRET is not defined in .env file',
      );
    }

    const jwtRefreshExpiration = this.parseJwtExpiration(
      this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      7 * 24 * 60 * 60,
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.userId },
      {
        secret: jwtRefreshSecret,
        expiresIn: jwtRefreshExpiration,
      },
    );

    await this.usersService.setCurrentRefreshToken(
      refreshToken,
      user.userId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: any) {
    const userFromDb =
      await this.usersService.getUserIfRefreshTokenMatches(
        user.refreshToken,
        user.userId,
      );

    if (!userFromDb) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = {
      sub: userFromDb.userId,
      email: userFromDb.email,
      role: userFromDb.role,
    };

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not defined in .env file',
      );
    }

    const jwtExpiration = this.parseJwtExpiration(
      this.configService.get<string>('JWT_EXPIRATION'),
      15 * 60,
    );

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiration,
    });

    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtRefreshSecret) {
      throw new InternalServerErrorException(
        'JWT_REFRESH_SECRET is not defined in .env file',
      );
    }

    const jwtRefreshExpiration = this.parseJwtExpiration(
      this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      7 * 24 * 60 * 60,
    );

    const refreshToken = this.jwtService.sign(
      { sub: userFromDb.userId },
      {
        secret: jwtRefreshSecret,
        expiresIn: jwtRefreshExpiration,
      },
    );

    await this.usersService.setCurrentRefreshToken(
      refreshToken,
      userFromDb.userId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
