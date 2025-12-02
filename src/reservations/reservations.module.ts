import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationModel } from './entities/reservation.entity';
import { PerformanceModel } from '../performances/entities/performances.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationModel, PerformanceModel])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
