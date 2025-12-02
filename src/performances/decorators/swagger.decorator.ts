import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePerformanceDto } from '../dto/create-performance.dto';
import { UpdatePerformanceDto } from '../dto/update-performance.dto';

export function ApiGetPerformances() {
  return applyDecorators(
    ApiOperation({
      summary: '공연 목록 조회',
      description: '등록된 모든 공연의 목록을 조회합니다.',
    }),
    ApiResponse({
      status: 200,
      description: '공연 목록 조회 성공',
      type: CreatePerformanceDto,
      isArray: true,
    }),
  );
}

export function ApiGetPerformance() {
  return applyDecorators(
    ApiOperation({
      summary: '공연 상세 조회',
      description: '특정 공연의 상세 정보를 조회합니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '공연 상세 조회 성공',
      type: CreatePerformanceDto,
    }),
    ApiResponse({
      status: 404,
      description: '공연을 찾을 수 없습니다.',
    }),
  );
}

export function ApiCreatePerformance() {
  return applyDecorators(
    ApiOperation({
      summary: '공연 등록',
      description: '새로운 공연을 등록합니다.',
    }),
    ApiBody({
      type: CreatePerformanceDto,
    }),
    ApiResponse({
      status: 201,
      description: '공연 등록 성공',
      type: CreatePerformanceDto,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청 - 필수 필드 누락 또는 유효성 검사 실패',
    }),
  );
}

export function ApiUpdatePerformance() {
  return applyDecorators(
    ApiOperation({
      summary: '공연 수정',
      description: '기존 공연 정보를 수정합니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiBody({
      type: UpdatePerformanceDto,
    }),
    ApiResponse({
      status: 200,
      description: '공연 수정 성공',
      type: UpdatePerformanceDto,
    }),
    ApiResponse({
      status: 404,
      description: '공연을 찾을 수 없습니다.',
    }),
  );
}

export function ApiDeletePerformance() {
  return applyDecorators(
    ApiOperation({
      summary: '공연 삭제',
      description: '공연을 삭제합니다.',
    }),
    ApiParam({
      name: 'performanceId',
      description: '공연 ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: '공연 삭제 성공',
      schema: {
        example: {
          message: '해당 1 공연 정보가 삭제되었습니다.',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: '공연을 찾을 수 없습니다.',
    }),
  );
}
