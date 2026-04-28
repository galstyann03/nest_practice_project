import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async findAll() {
    return this.bookModel.find().populate('author').exec();
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id).populate('author').exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const book = new this.bookModel(createBookDto);
    return book.save();
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async remove(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
}
