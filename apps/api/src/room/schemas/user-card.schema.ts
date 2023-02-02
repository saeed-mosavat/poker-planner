import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { Card } from 'src/card/schemas/card.schema';

export type UserCardDocument = HydratedDocument<UserCard>;

@Schema()
export class UserCard {
  @Prop({
    isRequired: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Card.name,
    nullable: true,
    default: null,
  })
  card?: Card | null;

  @Prop({
    default: false,
  })
  isAdmin?: boolean;

  @Prop({
    default: true,
  })
  canVote?: boolean;
}

export const UserCardSchema = SchemaFactory.createForClass(UserCard);
