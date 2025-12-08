import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  ApiCreateReservation,
  ApiConfirmReservation,
  ApiCancelReservation,
  ApiRefundReservation,
} from './decorators/swagger.decorator';
import { UserGuard } from '../common/guards/user.guard';
import { GetReservationParams } from '../common/decorators';
import { ReservationParamsDto } from './dto/reservation-params.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(UserGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':performanceId')
  @ApiCreateReservation()
  postReservation(
    @GetReservationParams()
    { performanceId }: ReservationParamsDto,
    @Body('seatCount') seatCount: number,
  ) {
    return this.reservationsService.reservation(performanceId, seatCount);
  }

  @Patch(':performanceId/:reservationId/confirm')
  @ApiConfirmReservation()
  patchConfirmReservation(
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.confirmReservation(
      performanceId,
      reservationId,
    );
  }

  @Patch(':performanceId/:reservationId/cancel')
  @ApiCancelReservation()
  patchCancelReservation(
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.cancelReservation(
      performanceId,
      reservationId,
    );
  }

  @Patch(':performanceId/:reservationId/refund')
  @ApiRefundReservation()
  patchRefundReservation(
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.refundReservation(
      performanceId,
      reservationId,
    );
  }
}
