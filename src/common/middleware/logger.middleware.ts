import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers } = req;

    this.logger.log(`${method} ${originalUrl}`);
    this.logger.log(`Headers: ${JSON.stringify(headers, null, 2)}`);

    // x-user-id 헤더 특별히 확인
    const userId = headers['x-user-id'];
    const authorization = headers['authorization'];

    if (userId) {
      this.logger.log(`✅ x-user-id: ${userId}`);
    } else {
      this.logger.warn(`⚠️ x-user-id 헤더 없음`);
    }

    if (authorization) {
      this.logger.log(`✅ Authorization: ${authorization.substring(0, 20)}...`);
    }

    next();
  }
}
