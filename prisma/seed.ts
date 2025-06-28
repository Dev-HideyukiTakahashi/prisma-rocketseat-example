import { prisma } from '@/prisma';

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Maria',
        email: 'maria@email.com',
      },
      {
        name: 'José',
        email: 'josé@email.com',
      },
      {
        name: 'Ana',
        email: 'ana@email.com',
      },
    ],
  });
}

seed().then(() => {
  console.log('Database seeded!');
  prisma.$disconnect();
});
