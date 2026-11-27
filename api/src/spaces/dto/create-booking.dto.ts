
import {
  IsDateString,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsIn([
    'Study Room',
    'Discussion Room',
    'Computer Lab',
    'Conference Room',
  ])
  space: string;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime: string;
}
