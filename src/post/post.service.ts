import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import { CreatePostDto } from './dto/create.dto';
import { unlinkSync } from 'fs';
import { returnGetPosts } from './types/getPosts.type';
import { ApiFeature } from 'src/utils/apifeature';
import UpdatePostDto from './dto/update.dto';
@Injectable()
export class PostService {
  objectOptional: string;
  constructor(private readonly prisma: PrismaService) {
    this.objectOptional = JSON.stringify({
      select: {
        id: true,
        title: true,
        content: true,
        imageCover: true,
        images: true,
        user: {
          select: {
            id: true,
            fullname: true,
            imageCover: true,
            role: true,
          },
        },
        categories: { select: { id: true, name: true } },
        comments: {
          select: {
            id: true,
            content: true,
            parentId: true,
            postId: true,
            users: { select: { id: true, fullname: true, imageCover: true } },
          },
        },
        _count: { select: { likes: true, comments: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async createPost(
    data: CreatePostDto,
    images: { imageCover: string; images: string[] },
    user: any,
  ) {
    try {
      let foundPost = await this.prisma.post.findFirst({
        where: { title: data.title },
      });
      if (foundPost)
        throw new BadRequestException(
          'post with title ' + data.title + ' is existing',
        );
      let newPost = await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          imageCover: images[0].imageCover,
          images: images[1].images,
          user: {
            connect: { id: user.id },
          },
          categories: {
            connectOrCreate: data.categoryName.map((tag) => {
              return {
                where: { name: tag },
                create: { name: tag },
              };
            }),
          },
        },
      });

      return newPost;
    } catch (error) {
      console.log(error);
      this.deleteImage(images[0].imageCover, images[1].images);
      return error;
    }
  }
  async getPosts(query?): Promise<returnGetPosts> {
    const findPosts = await new ApiFeature(
      this.prisma,
      'post',
      JSON.parse(this.objectOptional),
    )
      .paginate(query?.paginate)
      .sort(query?.sort)
      .search(query?.search)
      .makeQuery();
    if (findPosts.data.length == 0) {
      throw new BadRequestException('No posts found');
    }
    return findPosts;
  }
  async getPostById(id: string): Promise<any> {
    let select = JSON.parse(this.objectOptional);
    const findPostById = await this.prisma.post.findUnique({
      where: { id: id },
      ...select,
    });
    if (!findPostById) throw new NotFoundException(`post ${id} not found`);
    return findPostById;
  }
  async getPostsSpecificUser(userId: string, data?: any) {
    let findUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new NotFoundException('user not found');
    const findPosts = await new ApiFeature(
      this.prisma,
      'post',
      JSON.parse(this.objectOptional),
      { userId: userId },
    )
      .paginate(data?.paginate)
      .search(data?.search)
      .sort(data?.sort)
      .makeQuery();
    if (findPosts.data && findPosts.data.length == 0)
      throw new NotFoundException('No posts found');
    return findPosts;
  }
  async filterPostCategories(categoriesFilter: string[], data) {
    const findPosts = await new ApiFeature(
      this.prisma,
      'post',
      JSON.parse(this.objectOptional),
      {
        categories: {
          some: { name: { in: categoriesFilter, mode: 'insensitive' } },
        },
      },
    )
      .search()
      .paginate(data.paginate)
      .makeQuery();
    return findPosts;
  }
  async updatePost(
    id: string,
    data?: UpdatePostDto,
    images?: [{ imageCover: string }, { images: string[] }] | any[] | any,
  ): Promise<any> {
    const findPost = await this.prisma.post.findUnique({
      where: { id: id },
      ...JSON.parse(this.objectOptional),
    });
    if (!findPost)
      throw new NotFoundException('No post with id ' + id + ' exists');
    const findTitle = await this.prisma.post.findFirst({
      where: {
        title: data.title,
        NOT: {
          id: id,
        },
      },
      ...JSON.parse(this.objectOptional),
    });
    if (findTitle)
      throw new BadRequestException('title' + data.title + 'is existing');
    let dataObj = {} as {
      title?: string;
      content?: string;
      imageCover?: string;
      images?: string[];
    };
    if (data.title) dataObj.title = data.title;
    if (data.content) dataObj.content = data.content;
    if (images) {
      dataObj.imageCover = images[0].imageCover;
      dataObj.images = images[1].images;
    }
    let updatedPost = await this.prisma.post.update({
      where: { id: id },
      data: dataObj,
      ...JSON.parse(this.objectOptional),
    });
    return updatedPost;
  }
  async deletePost(id: string) {
    const findPost = await this.prisma.post.findUnique({
      where: { id: id },
      ...JSON.parse(this.objectOptional),
    });
    if (!findPost)
      throw new NotFoundException("post with id '" + id + "' not found");
    return await this.prisma.post.delete({ where: { id: id } });
  }
  deleteImage(single: string, array: string[]): void {
    if (single) unlinkSync(`./uploads/${single}`);

    if (array && array.length !== 0)
      array.forEach((ele) => {
        unlinkSync(`./uploads/${ele}`);
      });
  }
}
