import { Module } from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceModel } from './entities/performances.entity';
import { ReservationModel } from './entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceModel, ReservationModel])],
  controllers: [PerformancesController],
  providers: [PerformancesService],
})
export class PerformancesModule {}
