import { Injectable, BadRequestException } from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';
import { ApiFeature } from 'src/utils/apifeature';

@Injectable()
export class FavoriteService {
  selectObject: any;
  constructor(private prisma: PrismaService) {
    this.selectObject = JSON.stringify({
      // select: {
      //   // id: true,
      //   user: { select: { id: true } },
      //   post: {
      //     select: {
      //       id: true,
      //       title: true,
      //       imageCover: true,
      //       user: { select: { id: true, fullname: true, imageCover: true } },
      //     },
      //   },
      //   createdAt: true,
      // },
      // // _count: {},
    });
  }
  async addToFavorite(userId: string, postId: string) {
    try {
      const AddFavorite = await this.prisma.favourite.create({
        data: {
          user: { connect: { id: userId } },
          post: { connect: { id: postId } },
        },
        ...JSON.parse(this.selectObject),
      });
      return AddFavorite;
    } catch (error) {
      console.log(error);
      if (error.code == 'P2002') {
        throw new BadRequestException(
          'You acttulay have this post in your favorites',
        );
      } else if (error.code == 'P2025') {
        throw new BadRequestException('No post exist with this id.');
      }
    }
  }
  async getAllFavoritePosts(userId: string, data?: any) {
    try {
      const favorites = await new ApiFeature(
        this.prisma,
        'favourite',
        JSON.parse(this.selectObject),
        { userId: userId },
      )
        .search(data?.search)
        .paginate(data?.paginate)
        .sort(['createdAt', 'desc'])
        .makeQuery();
      return favorites;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteFromFavorite(postId: string, userId: string) {
    try {
      await this.prisma.favourite.delete({
        where: { userId_postId: { userId, postId } },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'this favorite is not for you, or not exist',
      );
    }
  }
}
