import Joi from 'joi';
import detectInjection from '../../utilts/detectInhection.js';

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in name" }),
    email: Joi.string().email().optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in email" }),
    phone: Joi.string().min(10).max(15).optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in phone" }),
    address: Joi.string().min(10).max(100).optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in address" }),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
    location: Joi.string().max(255).optional().custom(detectInjection)
        .messages({ "string.injection": "Invalid characters detected in location" }),
    image: Joi.string().uri().optional()
}).min(1);  

export const deleteUserSchema = Joi.object({
    userId: Joi.string().hex().length(24).required()
});
