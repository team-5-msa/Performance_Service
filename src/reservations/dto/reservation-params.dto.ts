import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReservationParamsDto {
  @Type(() => Number)
  @IsNumber()
  performanceId: number;

  @Type(() => Number)
  @IsNumber()
  reservationId: number;
}
