import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../dto';
import { User } from '../models';
import { UsersService } from '../users/';

export interface RegistrationData {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto): Promise<RegistrationData> {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto): Promise<RegistrationData> {
    const registeredUser = await this.userService.getUserByEmail(dto.email);
    if (registeredUser) {
      throw new HttpException(`пользователь с email ${dto.email} уже зарегистрирован`, HttpStatus.BAD_REQUEST);
    }
    const password = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({ ...dto, password });
    return this.generateToken(user);
  }

  private generateToken(user: User): RegistrationData {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException(`пользователь с email ${dto.email} не зарегистрирован`, HttpStatus.BAD_REQUEST);
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (passwordEquals) return user;
    throw new UnauthorizedException({ message: 'не верный пароль' });
  }
}
