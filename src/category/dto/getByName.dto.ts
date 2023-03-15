import { IsString, Length } from 'class-validator';

export class GetByNameDto {
  @IsString()
  @Length(3, 48)
  name: string;
}
