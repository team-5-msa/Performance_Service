import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PerformanceModel } from 'src/performances/entities/performances.entity';
import {
  ReservationModel,
  ReservationStatus,
} from 'src/reservations/entities/reservation.entity';
import {
  MAX_SEATS_PER_RESERVATION,
  RESERVATION_EXPIRY_MINUTES,
} from './constants/reservations.const';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(PerformanceModel)
    private readonly performanceRepository: Repository<PerformanceModel>,
    @InjectRepository(ReservationModel)
    private readonly reservationRepository: Repository<ReservationModel>,
    private readonly dataSource: DataSource,
  ) {}
  async reservation(performanceId: number, seatCount: number) {
    if (!seatCount || seatCount <= 0) {
      throw new BadRequestException('예약 좌석 수는 1 이상이어야 합니다.');
    }

    if (seatCount > MAX_SEATS_PER_RESERVATION) {
      throw new BadRequestException(
        `한 번에 최대 ${MAX_SEATS_PER_RESERVATION}개까지만 예약 가능합니다.`,
      );
    }

    if (!Number.isInteger(seatCount)) {
      throw new BadRequestException('예약 좌석 수는 정수여야 합니다.');
    }

    return await this.dataSource.transaction(async (manager) => {
      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!performance) {
        throw new NotFoundException(
          `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
        );
      }

      if (performance.availableSeats < seatCount) {
        throw new BadRequestException(
          `요청하신 ${seatCount}석의 좌석이 부족합니다. (현재 잔여: ${performance.availableSeats}석)`,
        );
      }

      performance.availableSeats -= seatCount;
      await manager.save(PerformanceModel, performance);

      const expiresAt = new Date(
        Date.now() + RESERVATION_EXPIRY_MINUTES * 60 * 1000,
      );

      const reservation = manager.create(ReservationModel, {
        performanceId,
        seatCount,
        status: ReservationStatus.PENDING,
        expiresAt,
      });

      const savedReservation = await manager.save(
        ReservationModel,
        reservation,
      );

      return {
        performanceId,
        reservationId: savedReservation.id,
        title: performance.title,
        price: performance.price,
        availableSeats: performance.availableSeats,
        status: reservation.status,
        message: '임시 예약이 완료되었습니다.',
      };
    });
  }

  async confirmReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        relations: ['performance'],
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      if (reservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException('이미 확정된 예약입니다.');
      }
      if (reservation.status === ReservationStatus.EXPIRED) {
        throw new BadRequestException('만료된 예약입니다.');
      }
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('취소된 예약입니다.');
      }

      const now = Date.now();
      const expiresAtTime = new Date(reservation.expiresAt).getTime();

      if (now > expiresAtTime) {
        reservation.status = ReservationStatus.EXPIRED;
        await manager.save(ReservationModel, reservation);
        throw new BadRequestException('만료된 예약입니다.');
      }

      reservation.status = ReservationStatus.CONFIRMED;
      reservation.confirmedAt = new Date();
      await manager.save(ReservationModel, reservation);

      return {
        reservationId: reservation.id,
        performanceId: reservation.performanceId,
        title: reservation.performance.title,
        price: reservation.performance.price,
        availableSeats: reservation.performance.availableSeats,
        status: reservation.status,
        message: '예약이 확정되었습니다.',
      };
    });
  }

  async cancelReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      if (reservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException(
          '이미 확정된 예약은 해제할 수 없습니다. 환불을 이용해주세요.',
        );
      }

      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.EXPIRED
      ) {
        throw new BadRequestException('이미 취소되었거나 만료된 예약입니다.');
      }

      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!performance) {
        throw new NotFoundException('공연 정보를 찾을 수 없습니다.');
      }

      performance.availableSeats += reservation.seatCount;
      await manager.save(PerformanceModel, performance);

      reservation.status = ReservationStatus.CANCELLED;
      await manager.save(ReservationModel, reservation);

      return {
        reservationId: reservation.id,
        performanceId: performance.id,
        title: performance.title,
        price: performance.price,
        availableSeats: performance.availableSeats,
        status: reservation.status,
        message: '예약이 취소되었습니다.',
      };
    });
  }

  async refundReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new BadRequestException('확정된 예약만 환불 가능합니다.');
      }

      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!performance) {
        throw new NotFoundException('공연 정보를 찾을 수 없습니다.');
      }

      performance.availableSeats += reservation.seatCount;
      await manager.save(PerformanceModel, performance);

      reservation.status = ReservationStatus.CANCELLED;
      await manager.save(ReservationModel, reservation);

      return {
        reservationId: reservation.id,
        performanceId: performance.id,
        refundedSeats: reservation.seatCount,
        availableSeats: performance.availableSeats,
        status: reservation.status,
        message: '예약이 취소되었습니다.',
      };
    });
  }
}
