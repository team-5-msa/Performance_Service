import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformanceModel } from './entities/performances.entity';
import { Repository } from 'typeorm';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectRepository(PerformanceModel)
    private readonly performanceRepository: Repository<PerformanceModel>,
  ) {}

  async getAllPerformances() {
    return this.performanceRepository.find();
  }

  async getPerformanceById(id: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    return performance;
  }

  async createPerformance(performanceDto: CreatePerformanceDto) {
    const performance = this.performanceRepository.create(performanceDto);
    return this.performanceRepository.save(performance);
  }

  async updatePerformance(id: number, performanceDto: UpdatePerformanceDto) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    Object.assign(performance, performanceDto);
    return this.performanceRepository.save(performance);
  }

  async deletePerformance(id: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id },
    });

    if (!performance) {
      throw new NotFoundException(`해당 ${id} 공연 정보를 찾을 수 없습니다.`);
    }

    await this.performanceRepository.delete(id);
    return { message: `해당 ${id} 공연 정보가 삭제되었습니다.` };
  }
}
