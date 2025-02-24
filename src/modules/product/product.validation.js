import Joi from 'joi';
import detectInjection from '../../utilts/detectInhection.js';

export const createProductSchema = Joi.object({

    name: Joi.string().min(2).required().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in name" }),
    price: Joi.number().min(0).required(),
    priceAfterDiscount: Joi.number().min(0).default(0),
    description: Joi.string().min(10).max(100).required().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in description" }),
    stock: Joi.number().min(0).required(),
    sold: Joi.number().min(0).default(0),
    category: Joi.string().hex().length(24).required(),
    subCategory: Joi.string().hex().length(24).required(),
    brand: Joi.string().hex().length(24).required(),
    tag: Joi.string().optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in tag" }),
    productType: Joi.string().valid('tire', 'battary').default('tire')
})

export const fileSchema = Joi.object({
    imageCover: Joi.array().items(Joi.object().required()).min(1).max(1).required(),
    images: Joi.array().items(Joi.object().required()).min(1).max(10).required()
}).required()

export const getProductByIdSchema = Joi.object({
    productId: Joi.string().hex().length(24).required()
});

export const updateProductSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2).max(100).trim().optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in name" }),
    price: Joi.number().min(0).optional(),
    priceAfterDiscount: Joi.number().min(0).less(Joi.ref('price')).optional(),
    description: Joi.string().min(10).max(100).trim().optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in description" }),
    stock: Joi.number().min(0).integer().optional(),
    sold: Joi.number().min(0).integer().optional(),
    imageCover: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).min(1).optional(),
    category: Joi.string().hex().length(24).optional(),
    subCategory: Joi.string().hex().length(24).optional(),
    brand: Joi.string().hex().length(24).optional(),
    tag: Joi.array().items(Joi.string().hex().length(24)).optional(),
    productType: Joi.string().valid('tire', 'battary').optional()
}).unknown(true);

export const deleteProductSchema = Joi.object({
    productId: Joi.string().hex().length(24).required()
});

export const restoreProductSchema = Joi.object({
    productId: Joi.string().hex().length(24).required()
});

export const addTagSchema = Joi.object({
    tagId: Joi.string().hex().length(24).required()
});
