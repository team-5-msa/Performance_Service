import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CATEGORY } from '../entities/performances.entity';

export class CreatePerformanceDto {
  @ApiProperty({
    description: '공연 제목',
    example: '오페라의 유령',
  })
  @IsString()
  @IsNotEmpty({ message: '공연 제목은 필수입니다' })
  title: string;

  @ApiProperty({
    description: '공연 설명',
    example: '브로드웨이의 전설적인 뮤지컬 오페라의 유령',
  })
  @IsString()
  @IsNotEmpty({ message: '공연 설명은 필수입니다' })
  description: string;

  @ApiProperty({
    description: '공연 카테고리',
    enum: CATEGORY,
    example: CATEGORY.MUSICAL,
  })
  @IsEnum(CATEGORY, {
    message:
      '유효한 카테고리(THEATER, MUSICAL, CONCERT, EXHIBITION, MOVIE)를 선택하세요',
  })
  @IsNotEmpty({ message: '카테고리는 필수입니다' })
  category: CATEGORY;

  @ApiProperty({
    description: '공연 장소',
    example: '샤롯데씨어터',
  })
  @IsString()
  @IsNotEmpty({ message: '공연 장소는 필수입니다' })
  venue: string;

  @ApiPropertyOptional({
    description: '공연 포스터 이미지 URL',
    example: 'https://example.com/poster.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: '티켓 가격 (원)',
    example: 150000,
    minimum: 1,
  })
  @IsPositive({ message: '가격은 양수여야 합니다' })
  @IsNotEmpty({ message: '가격은 필수입니다' })
  price: number;

  @ApiProperty({
    description: '전체 좌석 수',
    example: 500,
    minimum: 1,
  })
  @IsPositive({ message: '전체 좌석 수는 양수여야 합니다' })
  @IsNotEmpty({ message: '전체 좌석 수는 필수입니다' })
  totalSeats: number;

  @ApiProperty({
    description: '예약 가능한 좌석 수',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty({ message: '예약 가능한 좌석수는 필수입니다' })
  availableSeats: number;
}
