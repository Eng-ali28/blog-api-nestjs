import { IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 48)
  name: string;
}
