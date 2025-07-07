import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: Partial<User>) {
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required');
    }
    
    const existing = await this.usersService.findAll();
    if (existing.find(u => u.email === data.email)) {
      throw new BadRequestException('Email already exists');
    }
    
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashed,
      role: data.role || UserRole.GUEST,
      isApproved: data.role === UserRole.ORGANIZER ? false : true,
    });
    return user;
  }

  async validateUser(email: string, password: string) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    if (user.role === UserRole.ORGANIZER && !user.isApproved) {
      throw new UnauthorizedException('Organizer account not approved');
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
