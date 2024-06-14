import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '5', description: 'Идентификатор пользователя' })
  @IsString({ message: 'поле должно быть строкой' })
  userId: string;

  @ApiProperty({ example: 'Заголовок', description: 'Заголовок поста' })
  @IsString({ message: 'поле должно быть строкой' })
  title: string;

  @ApiProperty({ example: 'Описание', description: 'Содержание поста' })
  @IsString({ message: 'поле должно быть строкой' })
  content: string;

  @ApiProperty({ example: 'файл', description: 'Файл изображения' })
  image: object;
}
