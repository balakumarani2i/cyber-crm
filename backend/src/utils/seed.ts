import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@crm.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      company: 'Tech Corp',
      address: '123 Main St, City, State 12345',
      status: 'ACTIVE',
      assignedTo: admin.id
    }
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1-555-0456',
      company: 'Business Inc',
      status: 'PROSPECT',
      assignedTo: admin.id
    }
  });

  // Create sample deals
  await prisma.deal.create({
    data: {
      customerId: customer1.id,
      title: 'Software License Deal',
      value: 50000,
      stage: 'PROPOSAL',
      probability: 75,
      expectedCloseDate: new Date('2024-02-15'),
      assignedTo: admin.id
    }
  });

  // Create sample tasks
  await prisma.task.create({
    data: {
      title: 'Follow up with John Doe',
      description: 'Discuss software requirements',
      dueDate: new Date('2024-01-20'),
      priority: 'HIGH',
      status: 'PENDING',
      assignedTo: admin.id,
      customerId: customer1.id
    }
  });

  // Create sample interaction
  await prisma.interaction.create({
    data: {
      customerId: customer1.id,
      userId: admin.id,
      type: 'CALL',
      subject: 'Initial consultation',
      description: 'Discussed project requirements and timeline',
      date: new Date()
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });