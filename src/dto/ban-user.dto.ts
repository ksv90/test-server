import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @ApiProperty({ example: '5', description: 'Идентификатор пользователя' })
  @IsNumber({}, { message: 'поле должно быть числом' })
  readonly userId: number;

  @ApiProperty({ example: 'Попытка взлома', description: 'Причина блокировки' })
  @IsString({ message: 'поле должно быть строкой' })
  readonly reason: string;
}
