import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dto';
import { AuthService, RegistrationData } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: HttpStatus.OK, type: 'registrationData' })
  @Post('/login')
  login(@Body() userDto: CreateUserDto): Promise<RegistrationData> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: HttpStatus.OK, type: 'registrationData' })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto): Promise<RegistrationData> {
    return this.authService.registration(userDto);
  }
}
