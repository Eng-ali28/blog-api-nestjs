import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GetPostType } from 'src/post/types/getPosts.type';
@Injectable()
class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  baseURL: string;
  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });
    this.baseURL = 'http://localhost:3000';
    this.$use(async (params, next) => {
      let result = await next(params);

      if (params.model == 'Post' && params.action === 'create') {
        let { images, imageCover } = result;
        result.imageCover = `${this.baseURL}/${imageCover}`;
        images.forEach((ele, ind) => {
          result.images[ind] = `${this.baseURL}/${ele}`;
        });
      }
      if (params.model == 'Comment' && params.action === 'create') {
        let { imageCover } = result.users;
        result.users.imageCover = `${this.baseURL}/${imageCover}`;
      }
      return result;
    });
    this.$use(async (params, next) => {
      let result = await next(params);
      if (
        params.model == 'Post' &&
        (params.action == 'findMany' ||
          params.action == 'findUnique' ||
          params.action === 'update')
      ) {
        if (Array.isArray(result)) {
          result = result.map((ele) => this.setUrlForGetting(ele));
        } else {
          result = this.setUrlForGetting(result);
        }
      }
      return result;
    });
  }
  setUrlForGetting(ele: GetPostType) {
    if (!ele) return;
    let {
      imageCover,
      images,
      user: { imageCover: userImage },
    } = ele;
    if (ele.comments.length !== 0) {
      ele.comments.forEach((element, ind) => {
        let { imageCover } = element.users;
        element.users.imageCover = this.baseURL + '/' + imageCover;
      });
    }
    ele.imageCover = `${this.baseURL}/${imageCover}`;
    images.forEach((element, ind) => {
      ele.images[ind] = `${this.baseURL}/${element}`;
    });
    ele.user.imageCover = `${this.baseURL}/${userImage}`;

    return ele;
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
export default PrismaService;
