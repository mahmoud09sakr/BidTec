import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KYE,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET_KYE
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Middleware to upload to Cloudinary (conditionally required)
export const uploadToCloudinary = (isRequired = true) => (req, res, next) => {

    if (!req.file) {
        if (isRequired) {
            return next(new Error('File upload is required'));
        }
        return next(); // Skip if file is optional
    }

    const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
            if (error) {
                return next(error);
            }

            req.file.cloudinaryResult = result;
            next();
        }
    );

    stream.end(req.file.buffer);
};

export { upload };
