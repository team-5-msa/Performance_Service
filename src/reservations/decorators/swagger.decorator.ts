import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { ReservationResponseDto } from '../dto/reservation-response.dto';

export function ApiCreateReservation() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-user-id',
      description: '사용자 ID (API Gateway에서 자동 추가)',
      example: 'user_12345',
      required: true,
    }),
    ApiOperation({
      summary: '좌석 임시 예약',
      description:
        '공연 좌석을 임시로 예약합니다. 10분 내 확정하지 않으면 자동 취소됩니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiBody({
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
    }),
    ApiResponse({
      status: 201,
      description: '좌석 임시 예약 성공',
      type: ReservationResponseDto,
    }),
    ApiResponse({
      status: 400,
      description:
        '예약 실패 - 예약 좌석 수는 1 이상이어야 합니다. 또는 한 번에 최대 10개까지만 예약 가능합니다. 또는 예약 좌석 수는 정수여야 합니다. 또는 요청하신 좌석이 부족합니다.',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
    ApiResponse({
      status: 404,
      description: '공연을 찾을 수 없습니다.',
    }),
  );
}

export function ApiConfirmReservation() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-user-id',
      description: '사용자 ID (API Gateway에서 자동 추가)',
      example: 'user_12345',
      required: true,
    }),
    ApiOperation({
      summary: '예약 확정',
      description: '임시 예약을 확정합니다. (결제 완료 후)',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiParam({
      name: 'reservationId',
      description: '예약 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '예약 확정 성공',
      type: ReservationResponseDto,
    }),
    ApiResponse({
      status: 400,
      description:
        '예약 확정 실패 - 이미 확정된 예약이거나, 만료되었거나, 취소된 예약입니다.',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
    ApiResponse({
      status: 403,
      description: '자신의 예약만 확정할 수 있습니다.',
    }),
    ApiResponse({
      status: 404,
      description: '예약 정보를 찾을 수 없습니다.',
    }),
  );
}

export function ApiCancelReservation() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-user-id',
      description: '사용자 ID (API Gateway에서 자동 추가)',
      example: 'user_12345',
      required: true,
    }),
    ApiOperation({
      summary: '예약 취소',
      description: '결제 전 임시 예약을 취소합니다. 좌석이 복구됩니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiParam({
      name: 'reservationId',
      description: '예약 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '예약 취소 성공',
      type: ReservationResponseDto,
    }),
    ApiResponse({
      status: 400,
      description:
        '예약 취소 실패 - 이미 확정된 예약은 해제할 수 없습니다. 또는 이미 취소되었거나 만료된 예약입니다.',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
    ApiResponse({
      status: 403,
      description: '자신의 예약만 취소할 수 있습니다.',
    }),
    ApiResponse({
      status: 404,
      description: '예약 정보를 찾을 수 없습니다.',
    }),
  );
}

export function ApiRefundReservation() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiHeader({
      name: 'x-user-id',
      description: '사용자 ID (API Gateway에서 자동 추가)',
      example: 'user_12345',
      required: true,
    }),
    ApiOperation({
      summary: '환불',
      description: '확정된 예약을 취소하고 환불합니다. 좌석이 복구됩니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiParam({
      name: 'reservationId',
      description: '예약 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '환불 성공',
      type: ReservationResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: '환불 실패 - 확정된 예약만 환불 가능합니다.',
    }),
    ApiResponse({
      status: 401,
      description: 'Authorization 헤더 필요',
    }),
    ApiResponse({
      status: 403,
      description: '자신의 예약만 환불할 수 있습니다.',
    }),
    ApiResponse({
      status: 404,
      description: '예약 정보를 찾을 수 없습니다.',
    }),
  );
}
