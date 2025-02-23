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

export const uploadToCloudinary = (isRequired = true) => async (req, res, next) => {
    try {
        if (!req.file && !req.files) {
            if (isRequired) {
                return next(new Error('File upload is required'));
            }
            return next();
        }
        console.log(req.file, "req.file");
        console.log(req.files, "req.files");


        if (req.file) {
            console.log("Uploading file to Cloudinary...");
            try {
                const result = await new Promise((resolve, reject) => {
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
                    stream.end(req.file.buffer);
                });

                console.log("Upload Successful:", result.secure_url);
                req.file.cloudinaryResult = result;
                return next();
            } catch (uploadError) {
                console.error("Upload Failed:", uploadError);
                return next(new Error("Cloudinary upload failed"));
            }
        }

        if (req.files) {
            console.log("Uploading multiple files...");
            try {
                for (const fieldName in req.files) {
                    req.files[fieldName] = await Promise.all(
                        req.files[fieldName].map(async (file) => {
                            const result = await new Promise((resolve, reject) => {
                                const stream = cloudinary.uploader.upload_stream(
                                    { resource_type: 'auto' },
                                    (error, result) => {
                                        if (error) reject(error);
                                        else resolve(result);
                                    }
                                );
                                stream.end(file.buffer);
                            });
                            return { ...file, cloudinaryResult: result };
                        })
                    );
                }
                return next();
            } catch (uploadError) {
                console.error("Multiple Upload Failed:", uploadError);
                return next(new Error("Cloudinary multiple upload failed"));
            }
        }
    } catch (error) {
        console.error("Unexpected Error:", error);
        return next(error);
    }
};

export { upload };
