import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: AuthenticatedRequest) {
    return {
      message: 'Profile retrieved successfully.',
      user: request.user,
    };
  }
}
