import 'dotenv/config';
import { prisma } from './prisma.js';

async function main() {
  const owners = [
    { name: 'Abdul Rehman', email: 'ar@test.com' },
    { name: 'Ayesha Rehman', email: 'ayesha.rehman@test.com' },
    { name: 'Test Name', email: 'test@test.com' },
    { name: 'David John', email: 'david@test.com' }
  ];

  for (const owner of owners) {
    const existing = await prisma.productOwner.findFirst({
      where: { name: owner.name }
    });

    if (!existing) {
      await prisma.productOwner.create({ data: owner });
    }
  }

  console.log('✅ Seed complete: product owners created/verified');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
