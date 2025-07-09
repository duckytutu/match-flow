import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    await AppDataSource.initialize();
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@pickleball.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      email: 'admin@pickleball.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isApproved: true, // Admin is auto-approved
    });
    
    await userRepository.save(adminUser);
    console.log('Admin user created successfully');
    console.log('Email: admin@pickleball.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdminUser(); 