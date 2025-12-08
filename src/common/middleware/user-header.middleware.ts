import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7); // "Bearer " 제거

        // JWT 토큰 디코딩 (검증 없이 - 로컬 개발용)
        const decoded = jwt.decode(token) as any;

        if (decoded && decoded.user_id) {
          // JWT의 user_id를 x-user-id 헤더로 추가
          req.headers['x-user-id'] = decoded.user_id;
        } else if (decoded && decoded.sub) {
          // 또는 sub 필드가 있으면 사용
          req.headers['x-user-id'] = decoded.sub;
        }
      } catch (error) {
        // JWT 파싱 실패 시 무시하고 계속 진행
        // (Guard에서 검증)
      }
    }

    next();
  }
}
