import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CATEGORY } from '../entities/performances.entity';

export class CreatePerformanceDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목은 필수입니다' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명은 필수입니다' })
  description: string;

  @IsEnum(CATEGORY, {
    message:
      '유효한 카테고리(THEATER, MUSICAL, CONCERT, EXHIBITION, MOVIE)를 선택하세요',
  })
  @IsNotEmpty({ message: '카테고리는 필수입니다' })
  category: CATEGORY;

  @IsString()
  @IsNotEmpty({ message: '공연 장소는 필수입니다' })
  venue: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsPositive({ message: '가격은 양수여야 합니다' })
  @IsNotEmpty({ message: '가격은 필수입니다' })
  price: number;

  @IsPositive({ message: '전체 좌석 수는 양수여야 합니다' })
  @IsNotEmpty({ message: '전체 좌석 수는 필수입니다' })
  totalSeats: number;

  @IsNumber()
  @IsNotEmpty({ message: '예약 가능한 좌석수는 필수입니다' })
  availableSeats: number;
}
