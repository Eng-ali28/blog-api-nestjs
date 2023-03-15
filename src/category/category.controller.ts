import {
  Controller,
  Body,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.dto';
import { GetByNameDto } from './dto/getByName.dto';
import { UpdateCategoryDto } from './dto/update.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  @Auth('User', 'Admin', 'Owner')
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.categoryService.createCategory(data);
  }
  @Get()
  async getCategories(@Query() query) {
    let data = { ...query };
    return await this.categoryService.getCategories(query);
  }
  @Get('name')
  async getCategoryByName(@Body() data: GetByNameDto) {
    return this.categoryService.getCategoryByName(data.name);
  }
  @Get(':id')
  async getCategryById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.getCategoryById(id);
  }
  @Patch(':id')
  @Auth('Admin', 'Owner')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, data.name);
  }
  @Delete(':id')
  @HttpCode(204)
  @Auth('Admin', 'Owner')
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
