import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PerformanceModel } from './entities/performances.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import {
  ReservationModel,
  ReservationStatus,
} from './entities/reservation.entity';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectRepository(PerformanceModel)
    private readonly performanceRepository: Repository<PerformanceModel>,
    @InjectRepository(ReservationModel)
    private readonly reservationRepository: Repository<ReservationModel>,
    private readonly dataSource: DataSource, // ⬅️ 트랜잭션용
  ) {}

  // 임시 예약 만료 시간 (분)
  private readonly RESERVATION_EXPIRY_MINUTES = 10;
  // 한 번에 예약 가능한 최대 좌석 수
  private readonly MAX_SEATS_PER_RESERVATION = 10;

  // 공연 목록 조회
  async getAllPerformances() {
    return this.performanceRepository.find();
  }

  // 공연 상세 조회
  async getPerformanceById(performanceId: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    return performance;
  }

  // 공연 등록
  async createPerformance(performanceDto: CreatePerformanceDto) {
    const performance = this.performanceRepository.create(performanceDto);
    return this.performanceRepository.save(performance);
  }

  // 공연 수정
  async updatePerformance(
    performanceId: number,
    performanceDto: UpdatePerformanceDto,
  ) {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    Object.assign(performance, performanceDto);
    return this.performanceRepository.save(performance);
  }

  // 공연 삭제
  async deletePerformance(performanceId: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    await this.performanceRepository.delete(performanceId);
    return { message: `해당 ${performanceId} 공연 정보가 삭제되었습니다.` };
  }

  /**
   * 좌석 임시 예약 → 좌석 임시 차감
   */
  async reservation(performanceId: number, seatCount: number) {
    // 1. 입력 검증
    if (!seatCount || seatCount <= 0) {
      throw new BadRequestException('예약 좌석 수는 1 이상이어야 합니다.');
    }

    if (seatCount > this.MAX_SEATS_PER_RESERVATION) {
      throw new BadRequestException(
        `한 번에 최대 ${this.MAX_SEATS_PER_RESERVATION}개까지만 예약 가능합니다.`,
      );
    }

    if (!Number.isInteger(seatCount)) {
      throw new BadRequestException('예약 좌석 수는 정수여야 합니다.');
    }

    // 2. 트랜잭션 시작
    return await this.dataSource.transaction(async (manager) => {
      // 3. Pessimistic Write Lock으로 공연 정보 조회
      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' }, // 🔒 Lock 걸기
      });

      if (!performance) {
        throw new NotFoundException(
          `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
        );
      }

      // 4. 차감 전에 먼저 체크
      if (performance.availableSeats < seatCount) {
        throw new BadRequestException(
          `요청하신 ${seatCount}석의 좌석이 부족합니다. (현재 잔여: ${performance.availableSeats}석)`,
        );
      }

      // 5. 좌석 차감
      performance.availableSeats -= seatCount;
      await manager.save(PerformanceModel, performance);

      // 6. 임시 예약 생성
      const expiresAt = new Date(
        Date.now() + this.RESERVATION_EXPIRY_MINUTES * 60 * 1000,
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
        availableSeats: performance.availableSeats, // 현재 남은 재고
        status: reservation.status,
        message: '임시 예약이 완료되었습니다.',
      };
    });
  }

  // 예약 확정
  async confirmReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        relations: ['performance'],
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      // 이미 확정된 예약인지 확인
      if (reservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException('이미 확정된 예약입니다.');
      }
      // 만료된 예약인지 확인
      if (reservation.status === ReservationStatus.EXPIRED) {
        throw new BadRequestException('만료된 예약입니다.');
      }
      // 취소된 예약인지 확인
      if (reservation.status === ReservationStatus.CANCELLED) {
        throw new BadRequestException('취소된 예약입니다.');
      }
      // 만료 시간 체크 (timestamp 비교로 타임존 이슈 해결)
      const now = Date.now();
      const expiresAtTime = new Date(reservation.expiresAt).getTime();

      if (now > expiresAtTime) {
        reservation.status = ReservationStatus.EXPIRED;
        await manager.save(ReservationModel, reservation);
        throw new BadRequestException('만료된 예약입니다.');
      }
      // 예약 확정
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

  // 예약 해제 (결제 전 취소)
  async cancelReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      // 이미 확정된 예약은 해제 불가
      if (reservation.status === ReservationStatus.CONFIRMED) {
        throw new BadRequestException(
          '이미 확정된 예약은 해제할 수 없습니다. 환불을 이용해주세요.',
        );
      }

      // 이미 취소되었거나 만료된 경우
      if (
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.EXPIRED
      ) {
        throw new BadRequestException('이미 취소되었거나 만료된 예약입니다.');
      }

      // 좌석 복구
      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!performance) {
        throw new NotFoundException('공연 정보를 찾을 수 없습니다.');
      }

      performance.availableSeats += reservation.seatCount;
      await manager.save(PerformanceModel, performance);

      // 예약 상태 변경
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

  // 환불 (결제 후 취소)
  async refundReservation(performanceId: number, reservationId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(ReservationModel, {
        where: { id: reservationId, performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException('예약 정보를 찾을 수 없습니다.');
      }

      // 확정된 예약만 환불 가능
      if (reservation.status !== ReservationStatus.CONFIRMED) {
        throw new BadRequestException('확정된 예약만 환불 가능합니다.');
      }

      // 좌석 복구
      const performance = await manager.findOne(PerformanceModel, {
        where: { id: performanceId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!performance) {
        throw new NotFoundException('공연 정보를 찾을 수 없습니다.');
      }

      performance.availableSeats += reservation.seatCount;
      await manager.save(PerformanceModel, performance);

      // 예약 상태 변경
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
