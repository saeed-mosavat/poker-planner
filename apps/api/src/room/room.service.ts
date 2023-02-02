import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { CreateTaskDto } from 'src/room/dto/create-task.dto';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    private readonly userService: UsersService,
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

  findOne(id: string) {
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

  // update(id: string, updateCardDto: UpdateCardDto) {
  //   return this.cardModel
  //     .findByIdAndUpdate(id, updateCardDto, { new: true })
  //     .exec();
  // }
  //
  // remove(id: string) {
  //   return this.cardModel.findByIdAndRemove(id).exec();
  // }
}
