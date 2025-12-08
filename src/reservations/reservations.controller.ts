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
import { GetReservationParams, GetUserId } from '../common/decorators';
import { ReservationParamsDto } from './dto/reservation-params.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(UserGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':performanceId')
  @ApiCreateReservation()
  postReservation(
    @GetUserId() userId: string,
    @GetReservationParams()
    { performanceId }: ReservationParamsDto,
    @Body('seatCount') seatCount: number,
  ) {
    return this.reservationsService.reservation(
      userId,
      performanceId,
      seatCount,
    );
  }

  @Patch(':performanceId/:reservationId/confirm')
  @ApiConfirmReservation()
  patchConfirmReservation(
    @GetUserId() userId: string,
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.confirmReservation(
      userId,
      performanceId,
      reservationId,
    );
  }

  @Patch(':performanceId/:reservationId/cancel')
  @ApiCancelReservation()
  patchCancelReservation(
    @GetUserId() userId: string,
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.cancelReservation(
      userId,
      performanceId,
      reservationId,
    );
  }

  @Patch(':performanceId/:reservationId/refund')
  @ApiRefundReservation()
  patchRefundReservation(
    @GetUserId() userId: string,
    @GetReservationParams()
    { performanceId, reservationId }: ReservationParamsDto,
  ) {
    return this.reservationsService.refundReservation(
      userId,
      performanceId,
      reservationId,
    );
  }
}
