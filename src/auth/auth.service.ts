import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './auth.dto';
import PrismaService from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async rigster(data: CreateUserDto, image?: string) {
    const newUser = await this.userService.createUser(data, image);
    if (!newUser) throw new NotFoundException("Can't create user.");
    return newUser;
  }
  async login(data: LoginDto, res: Response) {
    const findUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!findUser) throw new NotFoundException(`user ${data.email} not found`);
    await this.comparePassword(data.password, findUser.password);
    let { password, ...rest } = findUser;
    let token = this.jwtService.sign(rest);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ token: token });
  }
  async logout(req: Request, res: Response) {
    if (!req.cookies.token) throw new UnauthorizedException();
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json();
  }
  async comparePassword(password: string, hashPassword: string) {
    const match = await bcrypt.compare(password, hashPassword);
    if (!match) throw new UnauthorizedException('password mismatch');
    return true;
  }
}
