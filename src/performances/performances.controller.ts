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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@ApiTags('performances')
@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  // 공연 목록 조회
  @Get()
  @ApiOperation({
    summary: '공연 목록 조회',
    description: '등록된 모든 공연의 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공연 목록 조회 성공',
    schema: {
      example: [
        {
          id: 1,
          title: '오페라의 유령',
          description: '브로드웨이의 전설적인 뮤지컬',
          category: 'MUSICAL',
          venue: '샬롯데씨어터',
          imageUrl: 'https://example.com/poster.jpg',
          price: 150000,
          totalSeats: 500,
          availableSeats: 450,
        },
      ],
    },
  })
  getPerformances() {
    return this.performancesService.getAllPerformances();
  }

  // 공연 상세 조회
  @Get(':performanceId')
  @ApiOperation({
    summary: '공연 상세 조회',
    description: '특정 공연의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '공연 상세 조회 성공',
    schema: {
      example: {
        id: 1,
        title: '오페라의 유령',
        description: '브로드웨이의 전설적인 뮤지컬',
        category: 'MUSICAL',
        venue: '샬롯데씨어터',
        imageUrl: 'https://example.com/poster.jpg',
        price: 150000,
        totalSeats: 500,
        availableSeats: 450,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '공연을 찾을 수 없습니다.',
  })
  getPerformance(@Param('performanceId', ParseIntPipe) performanceId: number) {
    return this.performancesService.getPerformanceById(performanceId);
  }

  // 공연 등록
  @Post()
  @ApiOperation({
    summary: '공연 등록',
    description: '새로운 공연을 등록합니다.',
  })
  @ApiBody({
    type: CreatePerformanceDto,
  })
  @ApiResponse({
    status: 201,
    description: '공연 등록 성공',
    type: CreatePerformanceDto,
    schema: {
      example: {
        id: 1,
        title: '오페라의 유령',
        description: '브로드웨이의 전설적인 뮤지컬',
        category: 'MUSICAL',
        venue: '샬롯데씨어터',
        imageUrl: 'https://example.com/poster.jpg',
        price: 150000,
        totalSeats: 500,
        availableSeats: 500,
        createdAt: '2025-11-27T10:30:00Z',
        updatedAt: '2025-11-27T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 - 필수 필드 누락 또는 유효성 검사 실패',
  })
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  // 공연 수정
  @Patch(':performanceId')
  @ApiOperation({
    summary: '공연 수정',
    description: '기존 공연 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiBody({
    type: UpdatePerformanceDto,
  })
  @ApiResponse({
    status: 200,
    description: '공연 수정 성공',
    type: UpdatePerformanceDto,
    schema: {
      example: {
        id: 1,
        title: '오페라의 유령',
        description: '브로드웨이의 전설적인 뮤지컬',
        category: 'MUSICAL',
        venue: '샬롯데씨어터',
        imageUrl: 'https://example.com/poster.jpg',
        price: 150000,
        totalSeats: 500,
        availableSeats: 450,
        createdAt: '2025-11-27T10:30:00Z',
        updatedAt: '2025-11-27T11:45:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '공연을 찾을 수 없습니다.',
  })
  patchPerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(performanceId, body);
  }

  // 공연 삭제
  @Delete(':performanceId')
  @ApiOperation({
    summary: '공연 삭제',
    description: '공연을 삭제합니다.',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '공연 삭제 성공',
    schema: {
      example: {
        message: '해당 1 공연 정보가 삭제되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '공연을 찾을 수 없습니다.',
  })
  deletePerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.performancesService.deletePerformance(performanceId);
  }

  // 좌석 임시 예약 → 좌석 임시 차감
  @Post(':performanceId/reservations')
  @ApiOperation({
    summary: '좌석 임시 예약',
    description: '공연 좌석을 임시로 예약합니다. (10분간 유효)',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        seatCount: {
          type: 'number',
          description: '예약할 좌석 수 (1-10)',
          example: 2,
        },
      },
      required: ['seatCount'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '좌석 임시 예약 성공',
    schema: {
      example: {
        performanceId: 1,
        reservationId: 1,
        title: '오페라의 유령',
        price: 150000,
        availableSeats: 498,
        status: 'PENDING',
        message: '임시 예약이 완료되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      '예약 실패 - 예약 좌석 수는 1 이상이어야 합니다. 또는 한 번에 최대 10개까지만 예약 가능합니다. 또는 예약 좌석 수는 정수여야 합니다. 또는 요청하신 좌석이 부족합니다.',
  })
  @ApiResponse({
    status: 404,
    description: '공연을 찾을 수 없습니다.',
  })
  postReservation(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body('seatCount') seatCount: number,
  ) {
    return this.performancesService.reservation(performanceId, seatCount);
  }

  // 예약 확정
  @Patch(':performanceId/reservations/:reservationId/confirm')
  @ApiOperation({
    summary: '예약 확정',
    description: '임시 예약을 확정합니다. (결제 완료 후)',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiParam({
    name: 'reservationId',
    description: '예약 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '예약 확정 성공',
    schema: {
      example: {
        reservationId: 1,
        performanceId: 1,
        title: '오페라의 유령',
        price: 150000,
        availableSeats: 498,
        status: 'CONFIRMED',
        message: '예약이 확정되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '예약 정보를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description:
      '예약 확정 실패 - 이미 확정된 예약이거나, 만료되었거나, 취소된 예약입니다.',
  })
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
  @ApiOperation({
    summary: '예약 취소',
    description: '결제 전 임시 예약을 취소합니다. 좌석이 복구됩니다.',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiParam({
    name: 'reservationId',
    description: '예약 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '예약 취소 성공',
    schema: {
      example: {
        reservationId: 1,
        performanceId: 1,
        title: '오페라의 유령',
        price: 150000,
        availableSeats: 500,
        status: 'CANCELLED',
        message: '예약이 취소되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '예약 정보를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description:
      '예약 취소 실패 - 이미 확정된 예약은 해제할 수 없습니다. 또는 이미 취소되었거나 만료된 예약입니다.',
  })
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
  @ApiOperation({
    summary: '환불',
    description: '확정된 예약을 취소하고 환불합니다. 좌석이 복구됩니다.',
  })
  @ApiParam({
    name: 'performanceId',
    description: '공연 ID',
    example: 1,
  })
  @ApiParam({
    name: 'reservationId',
    description: '예약 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '환불 성공',
    schema: {
      example: {
        reservationId: 1,
        performanceId: 1,
        refundedSeats: 2,
        availableSeats: 500,
        status: 'CANCELLED',
        message: '예약이 취소되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '예약 정보를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '환불 실패 - 확정된 예약만 환불 가능합니다.',
  })
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
