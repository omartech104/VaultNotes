import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/notes.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) {}

  // 1. Create a new note
  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const newNote = this.notesRepository.create(createNoteDto);
    newNote.user = { id: userId } as any;
    return await this.notesRepository.save(newNote);
  }

  // 2. Find all notes (usually for a dashboard list)
  async findAll(userId: number): Promise<Note[]> {
    return await this.notesRepository.find({
      where: { user: { id: userId } }, // Only get notes belonging to this user
      order: { createdAt: 'DESC' }, // Show newest notes first
    });
  }

  // 3. Find one specific note
  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  // 4. Update a note
  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id); // Reuses the "exists" check
    const updatedNote = Object.assign(note, updateNoteDto);
    return await this.notesRepository.save(updatedNote);
  }

  // 5. Delete a note
  async remove(id: number): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
