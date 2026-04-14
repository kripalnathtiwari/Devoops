const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');

try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
        console.log('Created uploads directory');
    }
    const testFile = path.join(uploadsDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    console.log('Successfully wrote to uploads directory');
    fs.unlinkSync(testFile);
} catch (err) {
    console.error('Failed to write to uploads directory:', err);
}
