import brandModel from '../../database/model/brand.model.js';
import { AppError } from '../../errorHandling/AppError.js';
import { handleAsyncError } from '../../errorHandling/handelAsyncError.js';
import { v2 as cloudinary } from 'cloudinary';

// Create a new brand
export const createBrand = handleAsyncError(async (req, res) => {
    const { name } = req.body;
    
    const existingBrand = await brandModel.findOne({ name });
    if (existingBrand) {
        throw new AppError('Brand already exists', 400);
    }
    if (!req.file) {
        throw new AppError('Image is required', 400);
    }
    const image = req.file.cloudinaryResult.url;
    const addedBrand = await brandModel.create({ name, logo: image });
    res.json({ message: 'Brand added successfully', addedBrand });
});

export const getAllBrands = handleAsyncError(async (req, res) => {
    const brands = await brandModel.find({ isDeleted: { $ne: true } });
    if (!brands || brands.length === 0) {
        return res.json({ message: 'No active brands found' });
    }
    res.json({ message: 'Brands found successfully', brands });
});

export const getBrandById = handleAsyncError(async (req, res) => {
    const { brandId } = req.params;
    const brand = await brandModel.findById(brandId);
    if (!brand) {
        throw new AppError('Brand not found', 404);
    }
    if (brand.isDeleted) {
        throw new AppError('Brand is deleted', 400);
    }
    res.json({ message: 'Brand found successfully', brand });
});

export const getAllAdminBrands = handleAsyncError(async (req, res) => {
    const brands = await brandModel.find().populate('deletedBy', { name: 1, email: 1, phone: 1 });
    if (!brands || brands.length === 0) {
        return res.json({ message: 'No brands found' });
    }
    res.json({ message: 'All brands retrieved successfully', brands });
});

// Get all deleted brands (for admins)
export const getAllDeletedBrands = handleAsyncError(async (req, res) => {
    const brands = await brandModel.find({ isDeleted: true }).populate('deletedBy', { name: 1, email: 1, phone: 1 });
    if (!brands || brands.length === 0) {
        return res.json({ message: 'No deleted brands found' });
    }
    res.json({ message: 'Deleted brands retrieved successfully', brands });
});

// Update a brand
export const updateBrand = handleAsyncError(async (req, res) => {
    const { brandId } = req.params;
    const { name } = req.body;

    const existingBrand = await brandModel.findById(brandId);
    if (!existingBrand) {
        throw new AppError('Brand not found', 404);
    }
    if (existingBrand.isDeleted) {
        throw new AppError('Brand is deleted', 400);
    }

    if (req.file) {
        if (existingBrand.logo) {
            const publicId = existingBrand.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        existingBrand.logo = req.file.cloudinaryResult.url;
    }
    if (name) existingBrand.name = name;

    const updatedBrand = await existingBrand.save();
    res.json({ message: 'Brand updated successfully', updatedBrand });
});

// Delete a brand (soft delete)
export const deleteBrand = handleAsyncError(async (req, res) => {
    const { brandId } = req.params;

    const existingBrand = await brandModel.findById(brandId);
    if (!existingBrand) {
        throw new AppError('Brand not found', 404);
    }
    if (existingBrand.isDeleted) {
        throw new AppError('Brand is already deleted', 400);
    }

    existingBrand.isDeleted = true;
    existingBrand.deletedAt = new Date();
    existingBrand.deletedBy = req.user._id;

    const deletedBrand = await existingBrand.save();
    res.json({ message: 'Brand deleted successfully', deletedBrand });
});

// Restore a deleted brand
export const restoreBrand = handleAsyncError(async (req, res) => {
    const { brandId } = req.params;

    const existingBrand = await brandModel.findById(brandId);
    if (!existingBrand) {
        throw new AppError('Brand not found', 404);
    }
    if (!existingBrand.isDeleted) {
        throw new AppError('Brand is not deleted', 400);
    }

    existingBrand.isDeleted = false;
    existingBrand.deletedAt = null;
    existingBrand.deletedBy = null;

    const restoredBrand = await existingBrand.save();
    res.json({ message: 'Brand restored successfully', restoredBrand });
});