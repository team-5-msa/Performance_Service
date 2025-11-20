import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CATEGORY } from '../entities/performances.entity';
import { Type } from 'class-transformer';

export class CreatePerformanceDto {
  @IsString({ message: '공연 제목은 문자열이어야 합니다.' })
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
  @IsNotEmpty({ message: '장소는 필수입니다' })
  venue: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsPositive({ message: '가격은 양수여야 합니다' })
  @IsNotEmpty({ message: '가격은 필수입니다' })
  price: number;

  @Type(() => Date)
  @IsDate({ message: '공연 시작일은 유효한 날짜여야 합니다' })
  @IsNotEmpty({ message: '공연 시작일은 필수입니다' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: '공연 종료일은 유효한 날짜여야 합니다' })
  @IsNotEmpty({ message: '공연 종료일은 필수입니다' })
  endDate: Date;

  @IsNumber()
  @IsPositive({ message: '러닝타임은 양수여야 합니다' })
  @IsOptional()
  runningTime?: number;
}
