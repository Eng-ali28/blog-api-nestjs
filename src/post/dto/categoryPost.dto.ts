import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CategoryPostDto {
  @IsString({ each: true })
  @IsNotEmpty()
  @Length(1, 48, { each: true })
  name: string[];
}
