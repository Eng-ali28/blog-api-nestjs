import { BadRequestException } from '@nestjs/common';

export class ApiFeature {
  object: any;
  Model: string;
  prisma: any;
  paginateObject: any;
  whereObject: any;
  constructor(
    prisma?: any,
    Model?: string,
    objectOptional?: any,
    whereObject?: any,
  ) {
    this.object = { ...objectOptional } || {};
    this.Model = Model;
    this.prisma = prisma;
    this.paginateObject = {};
    this.whereObject = { ...whereObject } || {};
  }
  search(search?: string) {
    if (!search) {
      this.object = { where: { ...this.whereObject }, ...this.object };
      return this;
    }
    this.object = {
      where: {
        [search[0]]: {
          ...this.whereObject,
          contains: search[1],
          mode: 'insensitive',
        },
      },
      ...this.object,
    };
    return this;
  }
  sort(data?: any) {
    if (!data) return this;
    this.object = {
      ...this.object,
      orderBy: [
        {
          [data[0]]: data[1],
        },
      ],
    };
    return this;
  }
  paginate(data?: any) {
    if (!data) {
      this.paginateObject.page = 1;
      return this;
    }
    let pages = +data.page || 1;
    let takes = +data.take || 10;
    let skips = (+pages - 1) * +takes;
    this.object = { ...this.object, skip: skips, take: takes };
    this.paginateObject.page = pages;
    return this;
  }

  async makeQuery() {
    try {
      let data = await this.prisma[this.Model].findMany(this.object);
      this.paginateObject.result = data.length;
      return { paginate: this.paginateObject, data };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error in query params');
    }
  }
}
