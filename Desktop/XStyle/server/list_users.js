const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Total Users:', users.length);
  users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));
  await prisma.$disconnect();
}

main().catch(e => console.error(e));
