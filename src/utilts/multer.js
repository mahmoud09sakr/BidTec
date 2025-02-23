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
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            console.log('File received:', file.originalname);
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }
});

// Helper function to upload a single file
const uploadSingleFile = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(file.buffer);
    });
};

export const uploadToCloudinary = (isRequired = true) => async (req, res, next) => {
    try {
        console.log("Received Files:", req.files);

        if (!req.files || Object.keys(req.files).length === 0) {
            if (isRequired) {
                return next(new Error('File upload is required'));
            }
            return next();
        }

        // Upload single imageCover if exists
        if (req.files.imageCover) {
            try {
                console.log("Uploading imageCover to Cloudinary...");
                const result = await uploadSingleFile(req.files.imageCover[0]);
                req.files.imageCover[0].cloudinaryResult = result;
            } catch (error) {
                console.error("imageCover Upload Failed:", error);
                return next(new Error("Cloudinary imageCover upload failed"));
            }
        }

        // Upload multiple images if exists
        if (req.files.images) {
            try {
                console.log("Uploading multiple images...");
                const uploadedImages = await Promise.all(
                    req.files.images.map(async (file) => {
                        const result = await uploadSingleFile(file);
                        return { ...file, cloudinaryResult: result };
                    })
                );
                req.files.images = uploadedImages;
            } catch (error) {
                console.error("Multiple Images Upload Failed:", error);
                return next(new Error("Cloudinary multiple upload failed"));
            }
        }

        console.log("All files uploaded successfully!");
        next();
    } catch (error) {
        console.error("Unexpected Error:", error);
        return next(error);
    }
};

export { upload };
