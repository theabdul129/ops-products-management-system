import 'dotenv/config';
import { prisma } from './prisma.js';

async function main() {
  const owners = [
    { name: 'Aisha Khan', email: 'aisha.khan@healf.com' },
    { name: 'Omar Ali', email: 'omar.ali@healf.com' },
    { name: 'Sophia Chen', email: 'sophia.chen@healf.com' },
    { name: 'Daniel Smith', email: 'daniel.smith@healf.com' }
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
