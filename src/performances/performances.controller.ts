import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerformancesService } from './performances.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import {
  ApiGetPerformances,
  ApiGetPerformance,
  ApiCreatePerformance,
  ApiUpdatePerformance,
  ApiDeletePerformance,
} from './decorators/swagger.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('performances')
@Controller('performances')
@UseGuards(AuthGuard)
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  // 공연 목록 조회
  @Get()
  @ApiGetPerformances()
  getPerformances() {
    return this.performancesService.getAllPerformances();
  }

  // 공연 상세 조회
  @Get(':performanceId')
  @ApiGetPerformance()
  getPerformance(@Param('performanceId', ParseIntPipe) performanceId: number) {
    return this.performancesService.getPerformanceById(performanceId);
  }

  // 공연 등록
  @Post()
  @ApiCreatePerformance()
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  // 공연 수정
  @Patch(':performanceId')
  @ApiUpdatePerformance()
  patchPerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(performanceId, body);
  }

  // 공연 삭제
  @Delete(':performanceId')
  @ApiDeletePerformance()
  deletePerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.performancesService.deletePerformance(performanceId);
  }
}
