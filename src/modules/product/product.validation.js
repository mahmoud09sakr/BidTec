import Joi from 'joi';

export const createProductSchema = Joi.object({
    body: Joi.object({
        name: Joi.string().required().min(2),
        price: Joi.number().required().min(0),
        priceAfterDiscount: Joi.number().min(0).default(0),
        description: Joi.string().required().min(10).max(100),
        stock: Joi.number().required().min(0),
        sold: Joi.number().min(0).default(0),
        category: Joi.string().hex().length(24).required(),
        subCategory: Joi.string().hex().length(24).required(),
        brand: Joi.string().hex().length(24).required(),
        tag: Joi.string().optional(), // JSON string, parsed in createProduct
        productType: Joi.string().valid('tire', 'battary').default('tire')
    }),
    files: Joi.object({
        imageCover: Joi.array().items(Joi.object().required()).min(1).max(1).required(),
        images: Joi.array().items(Joi.object().required()).min(1).max(10).required()
    }).required()
});
export const getProductByIdSchema = Joi.object({
    productId: Joi.string().hex().length(24).required()
});

export const updateProductSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2).max(100).trim().optional(),
    price: Joi.number().min(0).optional(),
    priceAfterDiscount: Joi.number().min(0).less(Joi.ref('price')).optional(),
    description: Joi.string().min(10).max(100).trim().optional(),
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
})