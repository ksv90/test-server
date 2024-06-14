import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @ApiProperty({ example: '5', description: 'Идентификатор пользователя' })
  @IsNumber({}, { message: 'поле должно быть числом' })
  readonly userId: number;

  @ApiProperty({ example: 'ADMIN', description: 'Название роли' })
  @IsString({ message: 'поле должно быть строкой' })
  readonly value: string;
}
