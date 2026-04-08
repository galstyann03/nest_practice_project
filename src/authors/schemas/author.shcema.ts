import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
    @Prop({ required: true })
        name!: string;

    @Prop({ required: true })
        bio!: string;

    @Prop({ required: true })
        birthDate!: Date;

    @Prop({ required: true })
        nationality!: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
