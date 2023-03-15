import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create.dto';

class UpdatePostDto extends PartialType(CreatePostDto) {}

export default UpdatePostDto;
