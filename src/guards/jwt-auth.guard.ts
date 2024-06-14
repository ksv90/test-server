import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { User } from '../models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;
    const [bearer, token] = authorization?.split(' ') ?? [];
    if (!token || bearer !== 'Bearer') {
      throw new UnauthorizedException('пользователь не авторизован');
    }
    try {
      this.jwtService.verify<User>(token);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new UnauthorizedException(String(error));
    }
    return true;
  }
}
