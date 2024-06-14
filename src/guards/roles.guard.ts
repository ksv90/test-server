import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { User } from '../models';
import { ROLES_KEY } from './decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    const requiredRoles = this.reflector.getAllAndOverride<Array<string>>(ROLES_KEY, targets);
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;
    const [bearer, token] = authorization?.split(' ') ?? [];
    if (!token || bearer !== 'Bearer') {
      throw new UnauthorizedException('пользователь не авторизован');
    }
    let user: User;
    try {
      user = this.jwtService.verify<User>(token);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException(String(error));
    }
    const thereAccess = user.roles.some((role) => requiredRoles.includes(role.value));
    if (!thereAccess) {
      throw new HttpException('нет доступа', HttpStatus.FORBIDDEN);
    }
    return thereAccess;
  }
}
