import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { CreateTaskDto } from 'src/room/dto/create-task.dto';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  create(createRoomDto: CreateRoomDto) {
    const newRoom = new this.roomModel(createRoomDto);
    console.log(newRoom);
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
    return this.roomModel.findById(id).populate('cards').exec();
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
