import joi from "joi";

export const createSubCategorySchema = joi.object({
    name: joi.string().trim().min(2).max(50).required(),
    image: joi.string().uri().required(),
    categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const getSubCategorySchema = joi.object({
    subCategoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const deleteSubCategorySchema = joi.object({
    subCategoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const restoreSubCategorySchema = joi.object({
    subCategoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const updateSubCategorySchema = joi.object({
    subCategoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    name: joi.string().trim().min(2).max(50).optional(),
    slug: joi.string().trim().optional(),
    image: joi.string().uri().optional()
});
