import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new Error('x-user-id header is required');
    }

    return userId;
  },
);
