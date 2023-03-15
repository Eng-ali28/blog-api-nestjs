import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from 'src/category/dto/create.dto';
import { CreateCommentDto } from './create.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
