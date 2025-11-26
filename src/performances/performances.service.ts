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
  async getPerformanceById(id: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    return performance;
  }

  // 공연 등록
  async createPerformance(performanceDto: CreatePerformanceDto) {
    const performance = this.performanceRepository.create(performanceDto);
    return this.performanceRepository.save(performance);
  }

  // 공연 수정
  async updatePerformance(id: number, performanceDto: UpdatePerformanceDto) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    Object.assign(performance, performanceDto);
    return this.performanceRepository.save(performance);
  }

  // 공연 삭제
  async deletePerformance(id: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    await this.performanceRepository.delete(id);
    return { message: `해당 ${id} 공연 정보가 삭제되었습니다.` };
  }

  /**
   * 좌석 임시 예약 → 좌석 임시 차감
   * - Race Condition 방지 (Pessimistic Lock)
   * - 입력 검증
   * - 트랜잭션 처리
   * - 임시 예약 관리
   */
  async reserveSeats(id: number, seatCount: number) {
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
        where: { id },
        lock: { mode: 'pessimistic_write' }, // 🔒 Lock 걸기
      });

      if (!performance) {
        throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
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
      const expiresAt = new Date();
      expiresAt.setMinutes(
        expiresAt.getMinutes() + this.RESERVATION_EXPIRY_MINUTES,
      );

      const reservation = manager.create(ReservationModel, {
        performanceId: id,
        seatCount,
        status: ReservationStatus.PENDING,
        expiresAt,
      });

      const savedReservation = await manager.save(
        ReservationModel,
        reservation,
      );

      // 7. 응답 반환
      return {
        reservationId: savedReservation.id,
        performanceId: performance.id,
        title: performance.title,
        reservedSeats: performance.reservedSeats,
        availableSeats: performance.availableSeats,
        expiresAt: savedReservation.expiresAt,
        message: '좌석 임시 예약이 완료되었습니다.',
      };
    });
  }

  // 예약 확정
  async confirmReservation(id: number, reservationId: number) {}

  // 예약 해제
  async releaseReservation(id: number, reservationId: number) {}

  // 환불 (결제 후 취소)
  async refundSeats(id: number, reservationId: number) {}
}
