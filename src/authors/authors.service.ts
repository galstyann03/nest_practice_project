import { Injectable, NotFoundException } from '@nestjs/common';
import { Author } from './schemas/author.shcema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
    constructor(
        @InjectModel(Author.name) private authorModel: Model<Author>,
    ) {}

    async findAll() {
        return this.authorModel.find().exec();
    }

    async findOne(id: string) {
        const author = await this.authorModel.findById(id).exec();
        if (!author) {
            throw new NotFoundException('Author not found');
        }
        return author;
    }

    async create(createAuthorDto: CreateAuthorDto) {
        const createdAuthor = new this.authorModel(createAuthorDto);
        return createdAuthor.save();
    }

    async update(id: string, updateAuthorDto: UpdateAuthorDto) {
        const updatedAuthor = await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, { new: true }).exec();
        if (!updatedAuthor) {
            throw new NotFoundException('Author not found');
        }
        return updatedAuthor;
    }

    async remove(id: string) {
        const author = await this.authorModel.findByIdAndDelete(id).exec();
        if (!author) {
            throw new NotFoundException('Author not found');
        }
        return author;
    }
}
