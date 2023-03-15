import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Req,
  Delete,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Auth()
  @Post(':postId')
  async createCommentForSpecificPost(
    @Req() req: Request,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() data: CreateCommentDto,
  ) {
    return await this.commentService.createCommentForSpecificPost(
      req.user.id,
      postId,
      data.content,
      data?.parentId,
    );
  }
  @Get(':parentId')
  @Auth()
  async getNestedComment(
    @Param('parentId', ParseUUIDPipe) parentId: string,
    @Query() data,
  ) {
    return await this.commentService.getNestedComments(parentId, data);
  }
  @Patch(':commentId')
  @Auth('User', 'Owner')
  async updateComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: Request,
    @Body() data: UpdateCommentDto,
  ) {
    return await this.commentService.updateComment(
      commentId,
      req.user.id,
      data,
    );
  }
  @Delete(':commentId')
  @HttpCode(204)
  @Auth('User', 'Owner')
  async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Req() req: Request,
  ) {
    return await this.commentService.deleteComment(commentId, req.user.id);
  }
}
