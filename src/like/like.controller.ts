import {
  Body,
  Controller,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { LikeService } from './like.service';
import { Request } from 'express';
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @Post()
  @Auth()
  async addToFavorite(
    @Body('postId', ParseUUIDPipe) postId: string,
    @Req() req: Request,
  ) {
    return await this.likeService.addLike(req.user.id, postId);
  }
  @Delete()
  @Auth()
  @HttpCode(204)
  async deleteFromFavorite(
    @Req() req: Request,
    @Body('postId', ParseUUIDPipe) postId: string,
  ) {
    return await this.likeService.deleteLike(postId, req.user.id);
  }
}
