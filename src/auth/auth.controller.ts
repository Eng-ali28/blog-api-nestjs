import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/user.dto';
import { SharpPipeImage } from 'src/utils/upload.pipe';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UseInterceptors(FileInterceptor('imageCover'))
  async rigster(
    @Body() data: CreateUserDto,
    @UploadedFile(SharpPipeImage) image?: string,
  ) {
    return await this.authService.rigster(data, image);
  }
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    return await this.authService.login(data, res);
  }
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
  }
}
