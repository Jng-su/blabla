import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from 'src/types/auth-request';

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    const userId = request.params.userId;

    const isSelf = user.id === userId;
    const isAdmin = user.role === 'admin';

    if (!isSelf && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    return true;
  }
}
