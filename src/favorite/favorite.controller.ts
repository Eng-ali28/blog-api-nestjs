import {
  Body,
  Controller,
  Post,
  Req,
  ParseUUIDPipe,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}
  @Post()
  @Auth()
  async addToFavorite(
    @Body('postId', ParseUUIDPipe) postId: string,
    @Req() req: Request,
  ) {
    return await this.favoriteService.addToFavorite(req.user.id, postId);
  }
  @Get()
  @Auth()
  async getFavorites(@Query() data, @Req() req: Request) {
    return await this.favoriteService.getAllFavoritePosts(req.user.id, data);
  }
  @Delete()
  @Auth()
  @HttpCode(204)
  async deleteFromFavorite(
    @Req() req: Request,
    @Body('postId', ParseUUIDPipe) postId: string,
  ) {
    return await this.favoriteService.deleteFromFavorite(postId, req.user.id);
  }
}
