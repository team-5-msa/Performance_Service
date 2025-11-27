import { Version } from '@nestjs/common';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum CATEGORY {
  THEATER = 'THEATER', // 연극
  MUSICAL = 'MUSICAL', // 뮤지컬
  CONCERT = 'CONCERT', // 콘서트
  EXHIBITION = 'EXHIBITION', // 전시
  MOVIE = 'MOVIE', // 영화
}

@Entity('performances')
export class PerformanceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string; // 공연 제목

  @Column({ type: 'text' })
  description: string; // 공연 설명

  @Column({ type: 'enum', enum: Object.values(CATEGORY) })
  category: CATEGORY; // 공연 카테고리(연극, 뮤지컬, 콘서트, 전시, 영화 등)

  @Column()
  venue: string; // 공연 장소

  @Column({ nullable: true })
  imageUrl?: string; // 포스터 이미지 URL

  @Column()
  price: number; // 티켓 가격

  @Column({ default: 0, nullable: false })
  totalSeats: number; // 전체 좌석 수

  @Column({ default: 0, nullable: false })
  availableSeats: number; // 현재 예약 가능한 좌석 수

  @Column({ default: 0, nullable: false })
  reservedSeats?: number; // CONFIRMED 상태의 총 예약 수

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @VersionColumn() // TypeORM에서 낙관적 락(Optimistic Lock)을 구현하기 위한 데코레이터
  // version: number; // Optimistic Lock을 위한 version 컬럼
}
