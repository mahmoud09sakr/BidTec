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
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

export const uploadToCloudinary = (isRequired = true) => async (req, res, next) => {
    try {
        console.log('Files received:', req.file || req.files);
        if (!req.file && !req.files) {
            if (isRequired) {
                return next(new AppError('File upload is required', 400));
            }
            return next(); 
        }
        console.log(req.file , req.files);
        
        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (error) {
                            reject(new AppError('Cloudinary upload failed', 500));
                        } else {
                            req.file.cloudinaryResult = result;
                            resolve();
                        }
                    }
                );
                stream.end(req.file.buffer);
            });
            await uploadPromise;
            return next();
        }
        if (req.files) {
            const uploadPromises = [];
            for (const fieldName in req.files) {
                const files = req.files[fieldName];
                files.forEach(file => {
                    const promise = new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) reject(new AppError('Cloudinary upload failed', 500));
                                resolve({ ...file, cloudinaryResult: result });
                            }
                        );
                        stream.end(file.buffer);
                    });
                    uploadPromises.push(promise);
                });
            }
            const uploadedFiles = await Promise.all(uploadPromises);
            req.files = uploadedFiles.reduce((acc, file) => {
                const fieldName = file.fieldname;
                if (!acc[fieldName]) acc[fieldName] = [];
                acc[fieldName].push(file);
                return acc;
            }, {});
            next();
        }
    } catch (error) {
        next(error);
    }
};

export { upload };