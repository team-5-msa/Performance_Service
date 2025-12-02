import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { ReservationParamsDto } from '../../reservations/dto/reservation-params.dto';

export const GetReservationParams = createParamDecorator<ReservationParamsDto>(
  (data: unknown, context: ExecutionContext): ReservationParamsDto => {
    const request = context.switchToHttp().getRequest<Request>();
    return plainToInstance(ReservationParamsDto, request.params);
  },
);
