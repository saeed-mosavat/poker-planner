import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { CreateTaskDto } from 'src/room/dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    return this.roomService.create(createRoomDto, req.user);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Post('/:roomId/tasks')
  addTasksToRoom(
    @Param('roomId') roomId: string,
    @Body() tasks: Array<CreateTaskDto>,
  ) {
    return this.roomService.addTasks(roomId, tasks);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomService.update(id, updateRoomDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomService.remove(id);
  // }
}
