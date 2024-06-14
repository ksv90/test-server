import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaType } from 'express';

import { CreatePostDto } from '../dto';
import { FilesService, MulterFile } from '../files';
import { Post } from '../models';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private filesService: FilesService,
  ) {}

  async createPost(dto: CreatePostDto, image: MulterFile): Promise<Post> {
    const imageName = await this.filesService.createFile(image);
    const post = await this.postRepository.create({ ...dto, imageName, userId: Number(dto.userId) });
    return post;
  }
}
