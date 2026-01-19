// src/auth/guards/refresh-jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {}