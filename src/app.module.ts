import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { pgConfig } from 'dbConfig';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // 1. THIS IS THE GLOBAL CONNECTION
    TypeOrmModule.forRoot(pgConfig),
    UsersModule,
    AuthModule,
    NotesModule,
  ],
})
export class AppModule {}