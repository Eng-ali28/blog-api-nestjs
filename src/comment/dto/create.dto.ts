import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 4000)
  content: string;
  @IsUUID(4)
  @IsOptional()
  parentId: string;
}
