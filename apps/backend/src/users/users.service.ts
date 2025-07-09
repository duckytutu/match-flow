import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async update(id: number, data: Partial<User>) {
    await this.usersRepository.update(id, data);
    return this.usersRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async approve(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    
    user.isApproved = true;
    return this.usersRepository.save(user);
  }

  async searchAthletes(search: string, excludeUserId?: number) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.levelPoint'])
      .where('user.role = :role', { role: 'athlete' })
      .andWhere('user.isApproved = :isApproved', { isApproved: true });

    // Exclude current user if provided
    if (excludeUserId) {
      query.andWhere('user.id != :excludeUserId', { excludeUserId });
    }

    if (search && search.trim()) {
      query.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search.trim()}%` }
      );
    }

    return query.limit(10).getMany();
  }
} 