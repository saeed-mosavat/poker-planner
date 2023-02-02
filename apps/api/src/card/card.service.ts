import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from 'src/card/schemas/card.schema';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  create(createCardDto: CreateCardDto) {
    const newCard = new this.cardModel(createCardDto);
    return newCard.save();
  }

  findAll() {
    return this.cardModel.find().exec();
  }

  findOne(id: string) {
    return this.cardModel.findById(id).exec();
  }

  findMany(ids: Array<string>) {
    return this.cardModel.find({ _id: { $in: ids } }).exec();
  }

  update(id: string, updateCardDto: UpdateCardDto) {
    return this.cardModel
      .findByIdAndUpdate(id, updateCardDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.cardModel.findByIdAndRemove(id).exec();
  }
}
