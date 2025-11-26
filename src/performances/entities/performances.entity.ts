import { Version } from '@nestjs/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
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
  @IsString({ message: '공연 제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '공연 제목은 필수입니다' })
  title: string; // 공연 제목

  @Column({ type: 'text' })
  @IsString({ message: '공연 설명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '공연 설명은 필수입니다' })
  description: string; // 공연 설명

  @Column({ type: 'enum', enum: Object.values(CATEGORY) })
  @IsEnum(CATEGORY, {
    message:
      '유효한 카테고리(THEATER, MUSICAL, CONCERT, EXHIBITION, MOVIE)를 선택하세요',
  })
  @IsNotEmpty({ message: '카테고리는 필수입니다' })
  category: CATEGORY; // 공연 카테고리(연극, 뮤지컬, 콘서트, 전시, 영화 등)

  @Column()
  @IsString({ message: '공연 장소는 문자열이어야 합니다' })
  @IsNotEmpty({ message: '공연 장소는 필수입니다' })
  venue: string; // 공연 장소

  @Column({ nullable: true })
  @IsString({ message: '포스터 이미지 URL은 문자열이어야 합니다' })
  @IsOptional()
  imageUrl?: string; // 포스터 이미지 URL

  @Column()
  @IsPositive({ message: '가격은 양수여야 합니다' })
  @IsNotEmpty({ message: '가격은 필수입니다' })
  price: number; // 티켓 가격

  @Column({ default: 0, nullable: false })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalSeats: number; // 전체 좌석 수

  @Column({ default: 0, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  reservedSeats: number; // CONFIRMED 상태의 총 예약 수

  @Column({ default: 0, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  availableSeats: number; // 현재 예약 가능한 좌석 수

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @VersionColumn() // TypeORM에서 낙관적 락(Optimistic Lock)을 구현하기 위한 데코레이터
  // version: number; // Optimistic Lock을 위한 version 컬럼
}
