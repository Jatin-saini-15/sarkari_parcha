import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@sarkariparcha.in' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@sarkariparcha.in',
        password: hashedPassword,
        role: 'owner',
        isPremium: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@sarkariparcha.in');
    console.log('Password: admin123');
    console.log('Role: owner');
    console.log('Admin ID:', admin.id);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 