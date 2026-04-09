import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    isbn!: string;

    @IsDateString()
    publishedDate!: string;

    @IsEnum(['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography', 'History'])
    genre!: string;

    @IsNumber()
    pages!: number;

    @IsString()
    @IsNotEmpty()
    summary!: string;

    @IsMongoId()
    author!: string;
}
