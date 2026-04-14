const { execSync } = require('child_process');
const fs = require('fs');

try {
    const out = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf-8' });
    fs.writeFileSync('db_push_out.txt', out);
    
    const genOut = execSync('npx prisma generate', { encoding: 'utf-8' });
    fs.writeFileSync('db_gen_out.txt', genOut);
} catch (e) {
    fs.writeFileSync('db_err.txt', e.message + '\n\n' + e.stdout + '\n\n' + e.stderr);
}
