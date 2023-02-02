import { Module } from '@nestjs/common';
import { RoomController } from 'src/room/room.controller';
import { RoomService } from 'src/room/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';
import { CardModule } from 'src/card/card.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    CardModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
