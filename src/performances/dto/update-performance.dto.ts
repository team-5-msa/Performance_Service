import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CATEGORY } from '../entities/performances.entity';
import { PartialType } from '@nestjs/swagger';
import { CreatePerformanceDto } from './create-performance.dto';

export class UpdatePerformanceDto extends PartialType(CreatePerformanceDto) {
  @ApiPropertyOptional({
    description: '공연 제목',
    example: '오페라의 유령',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: '공연 설명',
    example: '브로드웨이의 전설적인 뮤지컬 오페라의 유령',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '공연 카테고리',
    enum: CATEGORY,
    example: CATEGORY.MUSICAL,
  })
  @IsEnum(CATEGORY)
  @IsOptional()
  category?: CATEGORY;

  @ApiPropertyOptional({
    description: '공연 장소',
    example: '샤롯데씨어터',
  })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({
    description: '공연 포스터 이미지 URL',
    example: 'https://example.com/poster.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: '티켓 가격 (원)',
    example: 150000,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: '전체 좌석 수',
    example: 500,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalSeats?: number;

  @ApiPropertyOptional({
    description: '예약 가능한 좌석 수',
    example: 500,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  availableSeats?: number;
}
