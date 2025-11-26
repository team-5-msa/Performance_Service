import { PerformanceModel } from '../entities/performances.entity';
import { PickType } from '@nestjs/swagger';

export class CreatePerformanceDto extends PickType(PerformanceModel, [
  'title',
  'description',
  'category',
  'venue',
  'imageUrl',
  'price',
  'reservedSeats',
]) {}
