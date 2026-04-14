const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        fs.writeFileSync('debug.txt', 'Started\n');
        const prod = await prisma.product.findFirst();
        fs.appendFileSync('debug.txt', 'Product: ' + JSON.stringify(prod) + '\n');
    } catch(e) {
        fs.appendFileSync('debug.txt', 'Error: ' + e.toString() + '\n');
    } finally {
        await prisma.$disconnect();
        fs.appendFileSync('debug.txt', 'Done\n');
    }
}
main();
