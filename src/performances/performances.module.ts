import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { PerformanceModel } from './entities/performances.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceModel])],
  controllers: [PerformancesController],
  providers: [PerformancesService],
  exports: [PerformancesService],
})
export class PerformancesModule {}
