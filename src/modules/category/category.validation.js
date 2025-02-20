import joi from "joi";

export const createCategorySchema = joi.object({
    name: joi.string().trim().min(2).max(50).required(),
    image: joi.string().uri().optional()
});

export const updateCategorySchema = {
    params: joi.object({
        categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
            .messages({ "string.pattern.base": "Invalid categoryId format" })
    }),
    body: joi.object({
        name: joi.string().trim().min(2).max(50).optional(),
        slug: joi.string().trim().optional(),
        image: joi.string().uri().optional()
    })
};

export const getCategorySchema = joi.object({
    categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const deleteCategorySchema = joi.object({
    categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const restoreCategorySchema = joi.object({
    categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
});

export const getCategoryByIdSchema = joi.object({
    categoryId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})
