import { handleAsyncError } from '../../errorHandling/handelAsyncError.js';
import { AppError } from '../../errorHandling/AppError.js';
import productModel from '../../database/model/product.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createProduct = handleAsyncError(async (req, res) => {
    const { name, price, priceAfterDiscount, description, stock, sold, category, subCategory, brand, tag, productType } = req.body;
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) throw new AppError('Product already exists', 400);
    console.log(req.files, "req.filessssssssssssssssssssssssa");
    console.log(req.files.images, "req.filessssssssssssssssssssssssa");
    if (!req.files || !req.files.images) {
        throw new AppError('Image cover and at least one image are required', 400);
    }
    const imageCover = req.files.imageCover[0].cloudinaryResult.url;
    const images = req.files.images.map(file => file.cloudinaryResult.url);
    const product = await productModel.create({
        name, price, priceAfterDiscount, description, stock, sold,
        imageCover, images, category, subCategory, brand,
        tag: tag ? JSON.parse(tag) : undefined,
        productType
    });
    res.json({ message: 'Product created successfully', product });
});

export const getAllProducts = handleAsyncError(async (req, res) => {
    const products = await productModel.find({ isDeleted: false })
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name');
    if (!products.length) return res.json({ message: 'No active products found' });
    res.json({ message: 'Products retrieved successfully', products });
});

export const getProductById = handleAsyncError(async (req, res) => {
    const { productId } = req.params;
    const product = await productModel.findById(productId)
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name');
    if (!product) throw new AppError('Product not found', 404);
    if (product.isDeleted) throw new AppError('Product is deleted', 400);
    res.json({ message: 'Product retrieved successfully', product });
});

export const getAllAdminProducts = handleAsyncError(async (req, res) => {
    const products = await productModel.find()
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name')
        .populate('deletedBy', 'name email');
    if (!products.length) return res.json({ message: 'No products found' });
    res.json({ message: 'All products retrieved successfully', products });
});

export const getAllDeletedProducts = handleAsyncError(async (req, res) => {
    const products = await productModel.find({ isDeleted: true })
        .populate('category', 'name')
        .populate('subCategory', 'name')
        .populate('brand', 'name')
        .populate('deletedBy', 'name email');
    if (!products.length) return res.json({ message: 'No deleted products found' });
    res.json({ message: 'Deleted products retrieved successfully', products });
});

export const updateProduct = handleAsyncError(async (req, res) => {
    const { productId } = req.params;
    const { name, price, priceAfterDiscount, description, stock, sold, category, subCategory, brand, tag, productType } = req.body;
    const product = await productModel.findById(productId);
    if (!product) throw new AppError('Product not found', 404);
    if (product.isDeleted) throw new AppError('Product is deleted', 400);
    if (req.files) {
        if (req.files.imageCover) {
            if (product.imageCover) {
                const publicId = product.imageCover.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
            product.imageCover = req.files.imageCover[0].cloudinaryResult.url;
        }
        if (req.files.images) {
            if (product.images.length) {
                const publicIds = product.images.map(img => img.split('/').pop().split('.')[0]);
                await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
            }
            product.images = req.files.images.map(file => file.cloudinaryResult.url);
        }
    }
    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (priceAfterDiscount !== undefined) product.priceAfterDiscount = priceAfterDiscount;
    if (description) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (sold !== undefined) product.sold = sold;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (brand) product.brand = brand;
    if (tag) product.tag = JSON.parse(tag);
    if (productType) product.productType = productType;
    const updatedProduct = await product.save();
    res.json({ message: 'Product updated successfully', updatedProduct });
});

export const deleteProduct = handleAsyncError(async (req, res) => {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) throw new AppError('Product not found', 404);
    if (product.isDeleted) throw new AppError('Product is already deleted', 400);
    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user._id;
    const deletedProduct = await product.save();
    res.json({ message: 'Product deleted successfully', deletedProduct });
});

export const restoreProduct = handleAsyncError(async (req, res) => {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) throw new AppError('Product not found', 404);
    if (!product.isDeleted) throw new AppError('Product is not deleted', 400);
    product.isDeleted = false;
    product.deletedAt = null;
    product.deletedBy = null;
    const restoredProduct = await product.save();
    res.json({ message: 'Product restored successfully', restoredProduct });
});


export const addedTag = async (req, res, next) => {
    try {
        const { productId, tagId } = req.params;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        if (tagId) {
            const tagExists = product.tag.includes(tagId);
            if (tagExists) {
                product.tag = product.tag.filter((id) => id.toString() !== tagId);
            } else {
                product.tag.push(tagId);
            }
            await product.save();
            return res.status(200).json({
                status: 'success',
                message: tagExists ? 'Tag removed' : 'Tag added',
                data: product,
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'No tag ID provided; current tags returned',
            data: { tags: product.tag },
        });
    } catch (error) {
        next(error);
    }
};

export default addedTag;