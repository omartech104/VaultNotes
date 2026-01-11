import { Controller, Patch } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Get, Post, Body, Param } from '@nestjs/common';


@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Get()
    findAll() {
        return this.notesService.findAll();
    }

    @Post()
    create(@Body() createNoteDto: any) {
        return this.notesService.create(createNoteDto);
    }

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
