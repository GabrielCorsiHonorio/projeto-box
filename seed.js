const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.outputs.create({
    data: {
      name: "Built-in LED",
      board: 1,
      gpio: 2,
      state: 0
    }
  });

  await prisma.boards.create({
    data: {
      board: 1
    }
  });

  console.log('Data seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
