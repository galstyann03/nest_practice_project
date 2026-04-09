import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './schemas/review.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
    ) {}

    async findAllByBook(bookId: string) {
        return this.reviewModel.find({ book: bookId }).exec();
    }

    async findOne(id: string) {
        const review = await this.reviewModel.findById(id).exec();
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }

    async create(createReviewDto: CreateReviewDto) {
        const review = new this.reviewModel(createReviewDto);
        return review.save();
    }

    async update(id: string, updateReviewDto: UpdateReviewDto) {
        const review = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).exec();
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }

    async remove(id: string) {
        const review = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }
}
