const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@xstyle.com';
    const password = 'admin_password_2026'; // Change this to whatever you like
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            name: 'System Admin',
            email: email,
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('✅ Admin account created/updated!');
    console.log('Email:', admin.email);
    console.log('Password:', 'admin_password_2026');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
