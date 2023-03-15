import {
  Body,
  Controller,
  Post,
  Get,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  Delete,
  Param,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common/decorators';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { SharpPipeImages } from 'src/utils/upload.pipe';
import { CategoryPostDto } from './dto/categoryPost.dto';
import { CreatePostDto } from './dto/create.dto';
import UpdatePostDto from './dto/update.dto';
import { GetInterceptor } from './get.interceptor';
import { PostService } from './post.service';
import { GetPostType, returnGetPosts } from './types/getPosts.type';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @Auth('User', 'Admin', 'Owner')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
  )
  async createPost(
    @Body()
    data: CreatePostDto,
    @Req() req: Request,
    @UploadedFiles(SharpPipeImages)
    images: any,
  ) {
    return await this.postService.createPost(data, images, req.user);
  }
  @Get()
  // @Auth('User', 'Admin', 'Owner')
  async getPosts(@Query() data?): Promise<returnGetPosts> {
    return await this.postService.getPosts(data);
  }

  @Get('filterByCategory')
  @Auth('User', 'Admin', 'Owner')
  async filterByCategory(@Body() data: CategoryPostDto, @Query() paginate) {
    return await this.postService.filterPostCategories(data.name, paginate);
  }

  @Get(':id')
  @Auth('User', 'Admin', 'Owner')
  async getPostById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<GetPostType> {
    return await this.postService.getPostById(id);
  }

  @Get('user/:userId')
  @Auth('User', 'Admin', 'Owner')
  async getPostSpecificUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() data?,
  ) {
    return await this.postService.getPostsSpecificUser(userId, data);
  }
  @Put(':id')
  @Auth('User', 'Admin', 'Owner')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    GetInterceptor,
  )
  async updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data?: UpdatePostDto,
    @UploadedFiles(SharpPipeImages) images?: any | any[],
  ) {
    return await this.postService.updatePost(id, data, images);
  }

  @Delete(':id')
  @Auth('User', 'Admin', 'Owner')
  @HttpCode(204)
  async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    await this.postService.deletePost(id);
  }
}
