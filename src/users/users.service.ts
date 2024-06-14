import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { AddRoleDto, BanUserDto, CreateUserDto } from '../dto';
import { User } from '../models';
import { RolesService } from '../roles';

const DEFAULT_USER_ROLE = 'USER';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getRoleByValue(DEFAULT_USER_ROLE);
    if (!role) throw new HttpException(`роли ${DEFAULT_USER_ROLE} не существует`, HttpStatus.BAD_REQUEST);
    const user = await this.userRepository.create(dto);
    await user.$set('roles', role.id);
    user.roles = [role];
    return user;
  }

  async getAllUsers(): Promise<Array<User>> {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
    return user;
  }

  async addRole(dto: AddRoleDto): Promise<void> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const role = await this.roleService.getRoleByValue(dto.value);
    if (!role) {
      throw new HttpException('роль не найдена', HttpStatus.NOT_FOUND);
    }
    await user.$add('role', role.id);
  }

  async banUser(dto: BanUserDto): Promise<void> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.reason;
    await user.save();
  }
}
