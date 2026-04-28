import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  bio!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  @IsNotEmpty()
  nationality!: string;
}
