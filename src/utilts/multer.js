import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET_KEY
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

const uploadToCloudinary = (isRequired = true) => async (req, res, next) => {
    try {
        if ((!req.file && !req.files) && isRequired) {
            return next(new Error('File upload is required'));
        }

        const uploadFile = (file) => {
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

        if (req.file) {
            console.log("Uploading single file to Cloudinary...");
            try {
                req.file.cloudinaryResult = await uploadFile(req.file);
                console.log("Upload Successful:", req.file.cloudinaryResult.secure_url);
            } catch (uploadError) {
                return next(new Error("Cloudinary single file upload failed"));
            }
        }

        if (req.files) {
            console.log("Uploading multiple files to Cloudinary...");
            try {
                for (const fieldName in req.files) {
                    req.files[fieldName] = await Promise.all(
                        req.files[fieldName].map(async (file) => {
                            return { ...file, cloudinaryResult: await uploadFile(file) };
                        })
                    );
                }
            } catch (uploadError) {
                return next(new Error("Cloudinary multiple file upload failed"));
            }
        }

        next();
    } catch (error) {
        console.error("Unexpected Error:", error);
        return next(error);
    }
};

export { upload, uploadToCloudinary };