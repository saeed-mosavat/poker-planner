import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findById(id: string) {
    return this.userModel.findOne({ id }).exec();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id).exec();
  }

  async createOrUpdate(user: CreateUserDto) {
    const foundUser = await this.findByEmail(user.email);
    if (foundUser) {
      return await this.update(foundUser._id.toString(), user);
    }

    return await this.create(user);
  }
}
