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
import { UserGuard } from '../common/guards/user.guard';

@ApiTags('performances')
@Controller('performances')
@UseGuards(UserGuard)
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiGetPerformances()
  getPerformances() {
    return this.performancesService.getAllPerformances();
  }

  @Get(':performanceId')
  @ApiGetPerformance()
  getPerformance(@Param('performanceId', ParseIntPipe) performanceId: number) {
    return this.performancesService.getPerformanceById(performanceId);
  }

  @Post()
  @ApiCreatePerformance()
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  @Patch(':performanceId')
  @ApiUpdatePerformance()
  patchPerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(performanceId, body);
  }

  @Delete(':performanceId')
  @ApiDeletePerformance()
  deletePerformance(
    @Param('performanceId', ParseIntPipe) performanceId: number,
  ) {
    return this.performancesService.deletePerformance(performanceId);
  }
}
