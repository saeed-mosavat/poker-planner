import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({ isRequired: true })
  name: string;

  @Prop()
  finalPoint?: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
