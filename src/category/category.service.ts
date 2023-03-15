import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import PrismaService from 'prisma/prisma.service';
import { ApiFeature } from 'src/utils/apifeature';
import { CreateCategoryDto } from './dto/create.dto';
import { getCategory } from './types';
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory(data: CreateCategoryDto): Promise<getCategory> {
    const findCategory = await this.prisma.category.findFirst({
      where: { name: data.name },
    });
    if (findCategory)
      throw new BadRequestException(
        `category whith this name : ${data.name} already exists`,
      );
    const newCategory = await this.prisma.category.create({
      data: { name: data.name },
    });
    return newCategory;
  }
  async getCategories(data?) {
    let apiFeature = new ApiFeature(this.prisma, 'category');
    return await apiFeature
      .search(data?.search)
      .sort(data?.sort)
      .paginate(data?.paginate)
      .makeQuery();
  }
  async getCategoryByName(data: string) {
    let foundName = await this.prisma.category.findFirst({
      where: { name: data },
    });
    if (!foundName)
      throw new BadRequestException(
        'Category with name ' + data + ' not found',
      );
    return foundName;
  }
  async getCategoryById(id: string) {
    const foundId = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (!foundId)
      throw new BadRequestException("category with id '" + id + ' not found');
    return foundId;
  }
  async updateCategory(id: string, name: string) {
    let foundCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (!foundCategory)
      throw new NotFoundException('category with id ' + id + ' not found');
    let updatedCategory = await this.prisma.category.update({
      where: { id: id },
      data: { name: name },
    });
    return updatedCategory;
  }
  async deleteCategory(id: string) {
    let foundCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });
    if (!foundCategory)
      throw new NotFoundException('category with id ' + id + ' not found');

    return await this.prisma.category.delete({ where: { id: id } });
  }
}
