import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthorsModule,
    BooksModule,
    ReviewsModule,
  ],
})
export class AppModule {}
