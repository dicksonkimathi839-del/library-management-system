import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: number, dto: CreateBookingDto) {
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'End time must be later than start time.',
      );
    }

    const date = new Date(`${dto.date}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid booking date.');
    }

    const now = new Date();
    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
      ),
    );

    if (date < today) {
      throw new BadRequestException(
        'Booking date cannot be in the past.',
      );
    }

    const existingBookings =
      await this.prisma.spaceBooking.findMany({
        where: {
          space: dto.space,
          date,
        },
      });

    const conflict = existingBookings.some(
      (booking) =>
        dto.startTime < booking.endTime &&
        dto.endTime > booking.startTime,
    );

    if (conflict) {
      throw new ConflictException(
        'This space is already booked during the selected time.',
      );
    }

    return this.prisma.spaceBooking.create({
      data: {
        space: dto.space,
        date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        userId,
      },
      select: {
        id: true,
        space: true,
        date: true,
        startTime: true,
        endTime: true,
        userId: true,
        createdAt: true,
      },
    });
  }

  async getMyBookings(userId: number) {
    return this.prisma.spaceBooking.findMany({
      where: { userId },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }
}
