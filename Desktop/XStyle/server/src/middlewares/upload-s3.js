const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'xstyle-product-uploads',
    acl: 'public-read', // Ensure files are publicly accessible if needed
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, `products/${Date.now()}_${path.basename(file.originalname)}`);
    }
});

const s3Upload = multer({
    storage: s3Storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = s3Upload;
