import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user); 
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async updateRole(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    user.role = updateRoleDto.role;

    return this.usersRepository.save(user);
  }
}
