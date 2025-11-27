import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CATEGORY } from '../entities/performances.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePerformanceDto } from './create-performance.dto';

export class UpdatePerformanceDto extends PartialType(CreatePerformanceDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CATEGORY)
  @IsOptional()
  category?: CATEGORY;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalSeats?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  availableSeats?: number;
}
