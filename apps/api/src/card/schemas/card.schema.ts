import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema({
  timestamps: true,
})
export class Card {
  @Prop({ isRequired: true })
  label: string;

  @Prop({ isRequired: true })
  value: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
