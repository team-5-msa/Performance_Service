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
  @Get(':id')
  getPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.performancesService.getPerformanceById(id);
  }

  // 공연 등록
  @Post()
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  // 공연 수정
  @Patch(':id')
  patchPerformance(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(id, body);
  }

  // 공연 삭제
  @Delete(':id')
  deletePerformance(@Param('id', ParseIntPipe) id: number) {
    return this.performancesService.deletePerformance(id);
  }

  // 좌석 임시 예약 -> 좌석 임시 차감
  @Post(':id/reserve-seats')
  postReserveSeats(
    @Param('id', ParseIntPipe) id: number,
    @Body('seatCount') seatCount: number,
  ) {
    console.log(typeof seatCount);

    return this.performancesService.reserveSeats(id, seatCount);
  }

  // 예약 확정
  @Patch(':id/confirm-reservation')
  patchConfirmReservation(@Param('id', ParseIntPipe) id: number) {}

  // 예약 해제
  @Patch(':id/release-reservation')
  patchReleaseReservation(@Param('id', ParseIntPipe) id: number) {}

  // 환불
  @Post(':id/refund-seats')
  postRefundSeats(@Param('id', ParseIntPipe) id: number) {}
}
