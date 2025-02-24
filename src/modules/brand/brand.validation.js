import Joi from 'joi';
import detectInjection from '../../utilts/detectInhection.js';
detectInjection()

export const createBrandSchema = Joi.object({
    name: Joi.string().min(2).max(50).custom(detectInjection).required()
}).unknown(true); 

export const getBrandByIdSchema = Joi.object({
    brandId: Joi.string().hex().length(24).custom(detectInjection).required()
});

export const updateBrandSchema = Joi.object({
    name: Joi.string().min(2).max(50).custom(detectInjection).optional()
}).unknown(true); 

export const deleteBrandSchema = Joi.object({
    brandId: Joi.string().hex().length(24).custom(detectInjection).required()
});

export const restoreBrandSchema = Joi.object({
    brandId: Joi.string().hex().length(24).custom(detectInjection).required()
});
