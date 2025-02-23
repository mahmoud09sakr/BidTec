// src/utilts/multer.js
import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../errorHandling/AppError.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KYE,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET_KYE
});

console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KYE,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET_KYE ? 'Set' : 'Not Set'
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        console.log('Filtering file:', file.originalname, file.mimetype);
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

export const uploadToCloudinary = (isRequired = true) => async (req, res, next) => {
    try {
        //TODO: mtnsa4 t4el el logs yasta
        console.log('Files before upload:', req.files);
        console.log('File (single) before upload:', req.file);
        console.log('Body before upload:', req.body);
        //TODO: mtnsa4 t4el el logs yasta

        if (!req.files && !req.file && isRequired) {
            return next(new AppError('File upload is required', 400));
        }
        if (req.file) {
            const promise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', timeout: 15000 },
                    (error, result) => {
                        //TODO: mtnsa4 t4el el logs yasta
                        console.log('Cloudinary result for', req.file.originalname, error || result);
                        //TODO: mtnsa4 t4el el logs yasta

                        if (error) {
                            reject(new AppError('Cloudinary upload failed: ' + error.message, 500));
                        } else {
                            resolve({ ...req.file, cloudinaryResult: result });
                        }
                    }
                );
                stream.on('error', (err) => {
                    //TODO: mtnsa4 t4el el logs yasta
                    console.error('Cloudinary stream error:', err);
                    //TODO: mtnsa4 t4el el logs yasta
                    reject(err);
                });
                stream.end(req.file.buffer);
            });
            req.file = await promise;
            //TODO: mtnsa4 t4el el logs yasta
            console.log('File (single) after upload:', req.file);
            //TODO: mtnsa4 t4el el logs yasta
        }
        if (req.files) {
            const uploadedFiles = {};
            for (const fieldName in req.files) {
                const files = req.files[fieldName];
                const uploadPromises = files.map(file => {
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto', timeout: 15000 },
                            (error, result) => {
                                console.log('Cloudinary result for', file.originalname, error || result);
                                if (error) {
                                    reject(new AppError('Cloudinary upload failed: ' + error.message, 500));
                                } else {
                                    resolve({ ...file, cloudinaryResult: result });
                                }
                            }
                        );
                        stream.on('error', (err) => {
                            console.error('Cloudinary stream error:', err);
                            reject(err);
                        });
                        stream.end(file.buffer);
                    });
                });
                uploadedFiles[fieldName] = await Promise.all(uploadPromises);
            }
            req.files = uploadedFiles; // Preserve object structure
            console.log('Files after upload:', req.files);
        }

        next();
    } catch (error) {
        console.error('UploadToCloudinary error:', error);
        next(error);
    }
};

export { upload };