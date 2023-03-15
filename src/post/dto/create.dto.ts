import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 64)
  title: string;
  @IsNotEmpty()
  @IsString()
  @Length(64, 5000)
  content: string;
  images: string[];
  imagesCover: string;
  @IsNotEmpty()
  @IsString({ each: true })
  categoryName: string[];
}
