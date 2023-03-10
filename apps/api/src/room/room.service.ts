import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { CreateTaskDto } from 'src/room/dto/create-task.dto';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import { CardDocument } from 'src/card/schemas/card.schema';
import { CardService } from 'src/card/card.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    private readonly userService: UsersService,
    private readonly cardService: CardService,
  ) {}

  create(createRoomDto: CreateRoomDto, creator: UserDocument) {
    const newRoom = new this.roomModel(createRoomDto);
    newRoom.userCards.push({
      user: creator,
      isAdmin: true,
    });
    return newRoom.save();
  }

  findAll() {
    return this.roomModel.find().exec();
  }

  async addTasks(
    roomId: string,
    tasksDto: Array<CreateTaskDto>,
  ): Promise<Room> {
    const room = await this.roomModel.findById(roomId).exec();
    if (room) {
      room.tasks = [...tasksDto, ...room.tasks];
      return await this.roomModel
        .findByIdAndUpdate(roomId, room, { new: true })
        .exec();
    }
  }

  findOne(id: string): Promise<RoomDocument | null> {
    return this.roomModel
      .findById(id)
      .populate(['cards', 'userCards.user'])
      .exec();
  }

  async join(roomId: string, userId: string) {
    const room = await this.findOne(roomId);

    if (room) {
      const isAlreadyJoined = !!room.userCards.find(
        (userCard) => userCard.user._id.toString() === userId,
      );
      if (isAlreadyJoined) {
        return room;
      }

      const user = await this.userService.findById(userId);
      if (user) {
        room.userCards.push({
          user,
          isAdmin: false,
          card: null,
        });

        return await room.save();
      } else {
        throw Error('invalid user id!');
      }
    } else {
      throw Error('invalid room id!');
    }
  }

  async addCards(roomId: string, cardIds: Array<string>) {
    const room = await this.findOne(roomId);
    if (room === null) {
      throw Error('invalid room id');
    }
    const cards = await this.cardService.findMany(cardIds);
    room.cards.push(...cards);
    return room.save();
  }

  async vote(roomId: string, userId: string, cardId: string | null) {
    let card: CardDocument | null = null;
    if (cardId) {
      card = await this.cardService.findOne(cardId);
      if (!card) {
        throw Error('Invalid card id!');
      }
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw Error('Invalid user id!');
    }

    const room = await this.findOne(roomId);
    if (!room) {
      throw Error('Invalid room id!');
    }

    const isMemberOfRoom = !!room.userCards.find(
      (userCard) => userCard.user._id.toString() === userId && userCard.canVote,
    );

    if (!isMemberOfRoom) {
      throw Error('You can not vote in this room!');
    }

    if (!room.isVoting) {
      throw Error('The voting has finished!');
    }

    const isValidCard =
      card === null ||
      room.cards.find(
        (roomCard) => roomCard._id.toString() === card._id.toString(),
      );

    if (!isValidCard) {
      throw Error('The selected card is not valid!');
    }

    room.userCards = room.userCards.map((userCard) => {
      if (userCard.user._id.toString() === userId) {
        return { ...userCard, card };
      }
      return userCard;
    });

    return room.save();
  }
}
