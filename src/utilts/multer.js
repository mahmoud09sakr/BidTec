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

export const uploadToCloudinary = (isRequired = true, type = "array") => async (req, res, next) => {
    try {
        if (type === "array") {
            if (!req.files) {
                if (isRequired) {
                    return next(new Error('File upload is required'));
                }
                return next();
            }
            if (req.files.imageCover) {
                try {
                    const result = await uploadSingleFile(req.files.imageCover[0]);
                    req.files.imageCover[0].cloudinaryResult = result;
                } catch (error) {
                    return next(new Error("Cloudinary imageCover upload failed"));
                }
            }

            if (req.files.images) {
                try {
                    const uploadedImages = await Promise.all(
                        req.files.images.map(async (file) => {
                            const result = await uploadSingleFile(file);
                            return { ...file, cloudinaryResult: result };
                        })
                    );
                    req.files.images = uploadedImages;
                } catch (error) {
                    return next(new Error("Cloudinary multiple upload failed"));
                }
            }
        } else if (type === "single") {
            if (!req.file) {
                if (isRequired) {
                    return next(new Error('File upload is required'));
                }
                return next();
            }
            try {
                const result = await uploadSingleFile(req.file);
                req.file.cloudinaryResult = result;
            } catch (error) {
                return next(new Error("Cloudinary single image upload failed"));
            }
        }

        next();
    } catch (error) {
        return next(error);
    }
};

export { upload };