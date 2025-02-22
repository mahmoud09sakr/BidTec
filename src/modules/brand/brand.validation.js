import Joi from 'joi';

export const createBrandSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
}).unknown(true); 

export const getBrandByIdSchema = Joi.object({
    brandId: Joi.string().hex().length(24).required(),
});

export const updateBrandSchema = Joi.object({
    brandId: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2).max(50).optional(),
}).unknown(true); 

export const deleteBrandSchema = Joi.object({
    brandId: Joi.string().hex().length(24).required(),
});

export const restoreBrandSchema = Joi.object({
    brandId: Joi.string().hex().length(24).required(),
});