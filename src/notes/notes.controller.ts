import { Controller, Patch } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Get, Post, Body, Param } from '@nestjs/common';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() body: { title: string; content: string; userId: number }) {
    const { userId, ...dto } = body; // Separate userId from the rest of the note data
    return this.notesService.create(dto, userId);
  }

  @Get('user/:userId')
  findAll(@Param('userId') userId: number) {
    return this.notesService.findAll(userId);
  }

  // 3. Find One remains the same
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateNoteDto: any) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Post(':id/delete')
  remove(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}
