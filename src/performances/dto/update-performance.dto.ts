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

export class UpdatePerformanceDto {
  @IsString({ message: '공연 제목은 문자열이어야 합니다.' })
  @IsOptional()
  title?: string;

  @IsString({ message: '공연 설명은 문자열이어야 합니다.' })
  @IsOptional()
  description?: string;

  @IsEnum(CATEGORY, {
    message:
      '유효한 카테고리(THEATER, MUSICAL, CONCERT, EXHIBITION, MOVIE)를 선택하세요.',
  })
  @IsOptional()
  category?: CATEGORY;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsPositive({ message: '가격은 양수여야 합니다' })
  @IsOptional()
  price?: number;

  @Type(() => Date)
  @IsDate({ message: '공연 시작일은 유효한 날짜여야 합니다' })
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate({ message: '공연 종료일은 유효한 날짜여야 합니다' })
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsPositive({ message: '러닝타임은 양수여야 합니다' })
  @IsOptional()
  runningTime?: number;
}
