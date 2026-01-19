import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

interface RefreshRequest extends Request {
  user: {
    userId: string;
    refreshToken: string;
  };
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.authService.login(user);

    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    response.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('access_token', accessToken, {
      ...cookieOptions,
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return {
      message: 'Profile retrieved successfully',
      data: req.user,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!req.user?.refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { accessToken, refreshToken } = await this.authService.refresh(
      req.user,
    );

    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    response.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('access_token', accessToken, {
      ...cookieOptions,
      httpOnly: false,
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Token refreshed' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = req.user.userId;

    await this.authService.logout(userId);

    response.clearCookie('refresh_token', { path: '/' });
    response.clearCookie('access_token', { path: '/' });

    return { message: 'Logout successful' };
  }
}
