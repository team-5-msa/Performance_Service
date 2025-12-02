import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../entities/reservation.entity';

export class ReservationResponseDto {
  @ApiProperty({
    description: '공연 ID',
    example: 1,
  })
  performanceId: number;

  @ApiProperty({
    description: '예약 ID',
    example: 1,
  })
  reservationId: number;

  @ApiPropertyOptional({
    description: '공연 제목',
    example: '오페라의 유령',
  })
  title?: string;

  @ApiPropertyOptional({
    description: '티켓 가격',
    example: 150000,
  })
  price?: number;

  @ApiPropertyOptional({
    description: '예약 가능한 좌석 수',
    example: 498,
  })
  availableSeats?: number;

  @ApiPropertyOptional({
    description: '환불된 좌석 수',
    example: 2,
  })
  refundedSeats?: number;

  @ApiProperty({
    description: '예약 상태',
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ApiProperty({
    description: '응답 메시지',
    example: '임시 예약이 완료되었습니다.',
  })
  message: string;
}
