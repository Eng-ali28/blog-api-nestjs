import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  IsUUID,
  IsOptional,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  fullname: string;
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  @Length(8, 64)
  password: string;
  @IsString()
  @Length(8, 64)
  confirmPassword: string;
  @IsOptional()
  @IsString()
  imageCover: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserIdDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID(4)
  id: string;
}
export class UserEmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
export class UserPaginationDto {
  @Length(0, 3)
  @IsOptional()
  limit?: string | number;
  @Length(0, 3)
  @IsOptional()
  page?: string | number;
}
