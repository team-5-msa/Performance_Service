import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerformanceModel } from './performances.entity';

export enum ReservationStatus {
  PENDING = 'PENDING', // 임시 예약
  CONFIRMED = 'CONFIRMED', // 예약 확정
  CANCELLED = 'CANCELLED', // 취소됨
  EXPIRED = 'EXPIRED', // 만료됨
}

@Entity('reservations')
export class ReservationModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  performanceId: number;

  @ManyToOne(() => PerformanceModel)
  @JoinColumn({ name: 'performanceId' })
  performance: PerformanceModel;

  @Column({ nullable: true })
  userId?: number; // 예약한 사용자 ID (인증 구현 후 변경 가능)

  @Column()
  seatCount: number; // 예약 좌석 수

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // 만료 시간 (임시 예약의 경우 10분 후)

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date; // 확정 시간

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
