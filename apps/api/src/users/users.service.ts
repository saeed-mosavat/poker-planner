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
    return this.userModel.find();
  }

  findById(id: string) {
    return this.userModel.findOne({ id });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({ id });
    const newUser: User = { ...user, ...updateUserDto };
    if (user) {
      return this.userModel.findByIdAndUpdate(id, newUser);
    }
    throw Error('Not Found!');
  }

  remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
