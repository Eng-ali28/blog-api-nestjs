import {
  Controller,
  Body,
  Query,
  Param,
  Post,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import {
  CreateUserDto,
  UpdateUserDto,
  UserEmailDTO,
  UserIdDTO,
  UserPaginationDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() data: CreateUserDto) {
    let result = await this.userService.createUser(data);
    return result;
  }
  @Get()
  // @UseGuards(JwtGuard)
  @Auth('User')
  async getUsers(@Query() paginate: UserPaginationDto) {
    const users = await this.userService.getUsers(paginate);
    return users;
  }
  @Get('/email')
  async getUserByEmail(@Body() body: UserEmailDTO) {
    const result = await this.userService.getUserByEmail(body.email);
    return result;
  }
  @Get('/:id')
  async getUserById(@Param() param: UserIdDTO) {
    const result = await this.userService.getUserById(param.id);
    return result;
  }
  @Put(':id')
  async updateUser(@Param() param: UserIdDTO, @Body() data: UpdateUserDto) {
    const result = await this.userService.updateUser(param.id, data);
    return result;
  }
  @Delete(':id')
  async deleteUser(@Param() param: UserIdDTO) {
    return await this.userService.deleteUser(param.id);
  }
}
