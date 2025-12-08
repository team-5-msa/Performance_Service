import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceModel } from './entities/performances.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Injectable()
export class PerformancesService {
  private readonly logger = new Logger(PerformancesService.name);

  constructor(
    @InjectRepository(PerformanceModel)
    private readonly performanceRepository: Repository<PerformanceModel>,
  ) {}

  async getAllPerformances() {
    this.logger.log('모든 공연 조회');
    return await this.performanceRepository.find();
  }

  async getPerformanceById(performanceId: number) {
    this.logger.log(`공연 ${performanceId} 조회`);

    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      this.logger.warn(`공연 ${performanceId}를 찾을 수 없음`);
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    return performance;
  }

  async createPerformance(performanceDto: CreatePerformanceDto) {
    this.logger.log(`공연 생성: ${performanceDto.title}`);
    const performance = this.performanceRepository.create(performanceDto);
    return this.performanceRepository.save(performance);
  }

  async updatePerformance(
    performanceId: number,
    performanceDto: UpdatePerformanceDto,
  ) {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    Object.assign(performance, performanceDto);
    return this.performanceRepository.save(performance);
  }

  async deletePerformance(performanceId: number) {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
    });

    if (!performance) {
      throw new NotFoundException(
        `해당 ${performanceId} 공연 정보를 찾을 수 없습니다.`,
      );
    }

    await this.performanceRepository.delete(performanceId);
    return { message: `해당 ${performanceId} 공연 정보가 삭제되었습니다.` };
  }
}
