import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SpacesService } from './spaces.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

@Controller('spaces/bookings')
@UseGuards(JwtAuthGuard)
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  createBooking(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBookingDto,
  ) {
    return this.spacesService.createBooking(req.user.id, dto);
  }

  @Get('my')
  getMyBookings(@Req() req: AuthenticatedRequest) {
    return this.spacesService.getMyBookings(req.user.id);
  }
}
