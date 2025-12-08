import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { DataSource, Repository, LessThan } from 'typeorm';
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
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(PerformanceModel)
    private readonly performanceRepository: Repository<PerformanceModel>,
    @InjectRepository(ReservationModel)
    private readonly reservationRepository: Repository<ReservationModel>,
    private readonly dataSource: DataSource,
  ) {}
  async reservation(performanceId: number, seatCount: number) {
    this.logger.log(
      `공연 ${performanceId}에 대한 ${seatCount}개 좌석 예약 요청`,
    );
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
    this.logger.log(`공연 ${performanceId}의 예약 ${reservationId} 확정`);

    return await this.dataSource.transaction(async (manager) => {
      // Pessimistic Lock으로 동시 업데이트 방지
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        relations: ['performance'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      // 상태 확인 (lock 후 재확인)
      if (reservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException('이미 확정된 예약입니다.');
      }
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('취소되거나 환불된 예약입니다.');
      }
      if (reservation.status === ReservationStatus.EXPIRED) {
        throw new BadRequestException('만료된 예약입니다.');
      }

      // 만료 확인 (lock 후 재확인)
      const now = new Date();
      const expiresAtTime = new Date(reservation.expiresAt);

      if (now > expiresAtTime) {
        reservation.status = ReservationStatus.EXPIRED;
        await manager.save(ReservationModel, reservation);
        this.logger.warn(
          `예약 ${reservationId} 만료 감지 및 상태 변경 (확정 시도 중)`,
        );
        throw new BadRequestException('만료된 예약입니다.');
      }

      // 예약 확정 (lock이 유지되는 동안 진행)
      reservation.status = ReservationStatus.CONFIRMED;
      reservation.confirmedAt = new Date();
      await manager.save(ReservationModel, reservation);

      this.logger.log(`예약 ${reservationId} 확정 완료`);

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
    this.logger.log(`공연 ${performanceId}의 예약 ${reservationId} 취소`);
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
    this.logger.log(`공연 ${performanceId}의 예약 ${reservationId} 환불`);
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

  @Cron('0 */10 * * * *')
  async handleExpiredReservations() {
    this.logger.log('만료된 PENDING 예약 자동 처리 시작');

    try {
      await this.dataSource.transaction(async (manager) => {
        // 1. 만료된 PENDING 예약 조회 (pessimistic lock 적용)
        const expiredReservations = await manager.find(ReservationModel, {
          where: {
            status: ReservationStatus.PENDING,
            expiresAt: LessThan(new Date()),
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (expiredReservations.length === 0) {
          this.logger.log('만료된 예약이 없습니다.');
          return 0;
        }

        this.logger.log(
          `${expiredReservations.length}개의 만료된 예약 처리 중`,
        );

        // 2. Performance별 좌석 반환량 계산
        const seatUpdates = new Map<number, number>();
        for (const reservation of expiredReservations) {
          const current = seatUpdates.get(reservation.performanceId) || 0;
          seatUpdates.set(
            reservation.performanceId,
            current + reservation.seatCount,
          );
        }

        // 3. 각 Performance의 좌석 복구
        for (const [performanceId, seatCount] of seatUpdates) {
          await manager.increment(
            PerformanceModel,
            { id: performanceId },
            'availableSeats',
            seatCount,
          );
        }

        // 4. 만료된 예약 상태 일괄 업데이트
        const updateResult = await manager.update(
          ReservationModel,
          {
            status: ReservationStatus.PENDING,
            expiresAt: LessThan(new Date()),
          },
          { status: ReservationStatus.EXPIRED },
        );

        this.logger.log(
          `${updateResult.affected || 0}개의 예약이 EXPIRED 상태로 변경되었습니다.`,
        );

        return expiredReservations.length;
      });

      this.logger.log('만료된 PENDING 예약 자동 처리 완료');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`만료된 예약 자동 처리 중 오류 발생: ${errorMessage}`);
    }
  }
}
