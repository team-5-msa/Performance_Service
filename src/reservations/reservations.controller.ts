import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  ApiCreateReservation,
  ApiConfirmReservation,
  ApiCancelReservation,
  ApiRefundReservation,
} from './decorators/swagger.decorator';

@ApiTags('reservations')
@Controller('performances/:performanceId/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 좌석 임시 예약 → 좌석 임시 차감
  @Post()
  @ApiCreateReservation()
  postReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body('seatCount') seatCount: number,
  ) {
    return this.reservationsService.reservation(performanceId, seatCount);
  }

  // 예약 확정
  @Patch(':reservationId/confirm')
  @ApiConfirmReservation()
  patchConfirmReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationsService.confirmReservation(
      performanceId,
      reservationId,
    );
  }

  // 예약 취소 (결제 전 취소)
  @Patch(':reservationId/cancel')
  @ApiCancelReservation()
  patchCancelReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationsService.cancelReservation(
      performanceId,
      reservationId,
    );
  }

  // 환불 (결제 후 취소)
  @Patch(':reservationId/refund')
  @ApiRefundReservation()
  patchRefundReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationsService.refundReservation(
      performanceId,
      reservationId,
    );
  }
}
