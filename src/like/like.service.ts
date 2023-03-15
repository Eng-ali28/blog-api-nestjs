import { Injectable, BadRequestException } from '@nestjs/common';
import PrismaService from 'prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}
  async addLike(userId: string, postId: string) {
    try {
      const create = await this.prisma.like.create({
        data: { userId: userId, postId: postId },
      });
      return create;
    } catch (error) {
      throw new BadRequestException('Post with this id not exist.');
    }
  }
  async deleteLike(postId: string, userId: string) {
    try {
      await this.prisma.like.delete({
        where: { userId_postId: { userId, postId } },
      });
    } catch (error) {
      throw new BadRequestException('this react is not for you, or not exist');
    }
  }
}
