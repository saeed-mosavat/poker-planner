import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ isRequired: true })
  firstName: string;

  @Prop()
  lastName?: string;

  @Prop({ isRequired: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
