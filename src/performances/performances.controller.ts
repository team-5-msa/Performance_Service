import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  @ApiOperation({ summary: '공연 전체 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '공연 목록 조회 성공',
  })
  getPerformances() {
    return this.performancesService.getAllPerformances();
  }

  @Get(':id')
  @ApiOperation({ summary: '공연 상세 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '공연 상세 정보 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연 정보를 찾을 수 없음',
  })
  getPerformance(@Param('id') id: string) {
    return this.performancesService.getPerformanceById(+id);
  }

  @Post()
  @ApiOperation({ summary: '공연 등록' })
  postPerformances(@Body() body: CreatePerformanceDto) {
    return this.performancesService.createPerformance(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: '공연 정보 수정' })
  patchPerformance(
    @Param('id') id: string,
    @Body() body: UpdatePerformanceDto,
  ) {
    return this.performancesService.updatePerformance(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '공연 삭제' })
  @ApiResponse({
    status: 200,
    description: '공연 정보 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '공연 정보를 찾을 수 없음',
  })
  deletePerformance(@Param('id') id: string) {
    return this.performancesService.deletePerformance(+id);
  }
}
