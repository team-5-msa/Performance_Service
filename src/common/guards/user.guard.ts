import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('인증 토큰이 존재하지 않습니다.');
    }

    // if (!authHeader.startsWith('Bearer ')) {
    //   throw new UnauthorizedException(
    //     'Bearer 형식의 유효한 토큰이 필요합니다.',
    //   );
    // }

    // const token = authHeader.replace('Bearer ', '');
    // if (!token || token.trim().length === 0) {
    //   throw new UnauthorizedException('토큰 값이 비어있습니다.');
    // }

    return true;
  }
}
