import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Task, TaskSchema } from 'src/room/schemas/task.schema';
import { Card } from 'src/card/schemas/card.schema';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({ isRequired: true })
  name: string;

  @Prop({ type: [TaskSchema], default: [] })
  tasks: Array<Task>;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Card' })
  cards: Array<Card>;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
