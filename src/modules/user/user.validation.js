import Joi from 'joi';


export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(15).optional(),
    address: Joi.string().min(10).max(100).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    age: Joi.number().integer().min(18).max(100).optional(),
    location: Joi.string().max(255).optional(),
    image: Joi.string().uri().optional()
}).min(0); 

export const deleteUserSchema = Joi.object({
    userId: Joi.string().hex().length(24).required()
});