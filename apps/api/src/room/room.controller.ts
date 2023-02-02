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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Post('/:id/tasks')
  addTasksToRoom(
    @Param('id') roomId: string,
    @Body() tasks: Array<CreateTaskDto>,
  ) {
    return this.roomService.addTasks(roomId, tasks);
  }

  @Post('/:id/join')
  @UseGuards(JwtAuthGuard)
  joinRoom(@Param('id') roomId: string, @Req() req: Request) {
    return this.roomService.join(roomId, req.user._id.toString());
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
