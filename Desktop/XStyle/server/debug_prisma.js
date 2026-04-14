const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Starting query...');
  const users = await prisma.user.findMany();
  console.log('Result:', users.length, 'users found.');
}

main()
  .catch(e => {
    console.error('Prisma Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Disconnected.');
  });
