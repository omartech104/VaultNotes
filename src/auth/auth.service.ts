import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { type CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {} // Inject the Service, not the Repo!
  async signUp(dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;
    return result;
  }

  async findAllUsers() {
    return this.usersService.findAll();
  }
  async findUserById(id: number) {
    return this.usersService.findOne(id);
  }
}
