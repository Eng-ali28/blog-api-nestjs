import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import {
  Paginate,
  UserEntity,
  UserPagination,
  UsersResult,
} from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto, image?: string): Promise<UserEntity> {
    const findUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (findUser) {
      throw new BadRequestException('email is already exist');
    }
    if (data.password !== data.confirmPassword)
      throw new BadRequestException('password must be confirmed');
    const hashPassword = await this.hashPassword(data.password);
    const newUser = await this.prisma.user.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        password: hashPassword,
        imageCover: image,
      },
    });
    if (!newUser) throw new NotFoundException("User can't be created");
    const { password, ...rest } = newUser;
    return rest;
  }
  async getUsers(pagination: UserPagination): Promise<UsersResult> {
    const page = pagination.page || 1;
    const take = pagination.limit || 10;
    const skip = (+page - 1) * +take;
    const users = await this.prisma.user.findMany({ take: +take, skip: +skip });
    if (users.length == 0) {
      throw new BadRequestException('no users found');
    }
    let paginate: Paginate = {
      page: page,
      result: users.length,
    };
    return { paginate, users };
  }
  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException(`user ${id} not found`);
    let { password, ...rest } = user;
    return rest;
  }
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new NotFoundException(`user ${email} not found`);
    let { password, ...rest } = user;
    return rest;
  }
  async updateUser(id: string, data: UpdateUserDto) {
    await this.checkUserExist(id);
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: data,
    });
    let { password, ...rest } = updatedUser;
    return rest;
  }
  async deleteUser(id: string) {
    await this.checkUserExist(id);
    await this.prisma.user.delete({ where: { id: id } });
    return `delete user ${id}`;
  }
  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }
  async checkUserExist(id: string) {
    const findUser = await this.prisma.user.findUnique({ where: { id: id } });
    if (!findUser) throw new NotFoundException(`User ${id} not found`);
    return true;
  }
}
