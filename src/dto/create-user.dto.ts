import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
  @IsString({ message: 'поле должно быть строкой' })
  @IsEmail({}, { message: 'не корректный email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль пользователя' })
  @IsString({ message: 'поле должно быть строкой' })
  @Length(4, 16, { message: 'не менее 4 и не более 16 символов' })
  readonly password: string;
}
