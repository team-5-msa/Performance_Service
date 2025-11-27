import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  // 공연 목록 조회
  @Get()
  getPerformances() {
    return this.performancesService.getAllPerformances();
  }

  // 공연 상세 조회
  @Get(':performanceId')
  getPerformance(@Param('performanceId', ParseIntPipe) performanceId: number) {
    return this.performancesService.getPerformanceById(performanceId);
  }

  // 공연 등록
  @Post()
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  // 공연 수정
  @Patch(':performanceId')
  patchPerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(performanceId, body);
  }

  // 공연 삭제
  @Delete(':performanceId')
  deletePerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.performancesService.deletePerformance(performanceId);
  }

  // 좌석 임시 예약 → 좌석 임시 차감
  @Post(':performanceId/reservations')
  postReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body('seatCount') seatCount: number,
  ) {
    return this.performancesService.reservation(performanceId, seatCount);
  }

  // 예약 확정
  @Patch(':performanceId/reservations/:reservationId/confirm')
  patchConfirmReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.performancesService.confirmReservation(
      performanceId,
      reservationId,
    );
  }

  // 예약 취소 (결제 전 취소)
  @Patch(':performanceId/reservations/:reservationId/cancel')
  patchCancelReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.performancesService.cancelReservation(
      performanceId,
      reservationId,
    );
  }

  // 환불 (결제 후 취소)
  @Patch(':performanceId/reservations/:reservationId/refund')
  patchRefundReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Param('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.performancesService.refundReservation(
      performanceId,
      reservationId,
    );
  }
}
