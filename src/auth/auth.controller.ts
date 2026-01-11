import { Controller, Post, Body, Req, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserSchema, type CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/ValidationPipe.pipe';

interface LoginDto {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @UsePipes(new ZodValidationPipe(CreateUserSchema))
    async register(@Body() dto: CreateUserDto) {
        return this.authService.signUp(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.signIn(dto.email, dto.password);
    }
}