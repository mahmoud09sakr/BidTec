import Joi from 'joi';
const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');
const addProductToCartSchema = Joi.object({
    productId: objectIdSchema.required().messages({
        'string.pattern.base': 'Product ID must be a valid ObjectId',
        'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1'
    })
});
const removeProductFromCartSchema = Joi.object({
    id: objectIdSchema.required().messages({
        'string.pattern.base': 'Cart item ID must be a valid ObjectId',
        'any.required': 'Cart item ID is required'
    })
});

const updateProductQuantitySchema = Joi.object({
    id: objectIdSchema.required().messages({
        'string.pattern.base': 'Product ID must be a valid ObjectId',
        'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
    })
});

const applyCouponSchema = Joi.object({
    code: Joi.string().trim().min(3).max(50).required().messages({
        'string.base': 'Coupon code must be a string',
        'string.min': 'Coupon code must be at least 3 characters long',
        'string.max': 'Coupon code cannot exceed 50 characters',
        'any.required': 'Coupon code is required'
    })
});

export {
    addProductToCartSchema,
    removeProductFromCartSchema,
    updateProductQuantitySchema,
    applyCouponSchema
}