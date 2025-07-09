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
      role: data.role || UserRole.ATHLETE, // Default to ATHLETE instead of GUEST
      isApproved: false, // All new users need admin approval
    });
    
    // Return user without password, with approval status message
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      message: 'Registration successful. Please wait for admin approval before you can login.'
    };
  }

  async validateUser(email: string, password: string) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    // Check if user is approved (for all roles except ADMIN)
    if (user.role !== UserRole.ADMIN && !user.isApproved) {
      throw new UnauthorizedException('Account not approved. Please wait for admin approval.');
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

  // Method to create guest user for public routes
  createGuestUser() {
    return {
      id: 0,
      email: 'guest@example.com',
      firstName: 'Guest',
      lastName: 'User',
      role: UserRole.GUEST,
      isApproved: true,
    };
  }
}
