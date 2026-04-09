import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
    @Prop({ required: true})
    title!: string;

    @Prop({ required: true, unique: true })
    isbn!: string;

    @Prop({ required: true})
    publishedDate!: Date;

    @Prop({ required: true, enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography', 'History'] })
    genre!: string;

    @Prop({ required: true })
    pages!: number;

    @Prop({ required: true })
    summary!: string;

    @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
    author!: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
