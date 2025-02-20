import joi from "joi";
import { commonSchema } from "../../utilts/validation.js";

export const signUpSchema = joi.object({
    name: commonSchema.name
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({ "any.required": "Name is required" }),

    email: commonSchema.email
        .trim()
        .lowercase()
        .required()
        .email({
            minDomainSegments: 2,
            maxDomainSegments: 3,
            tlds: { allow: ["com", "net"] }
        })
        .messages({ "any.required": "Email is required" }),

    password: joi.string()
        .trim()
        .min(8)
        .max(100)
        .required()
        .messages({ "any.required": "Password is required" }),

    confirmPassword: joi.string()
        .trim()
        .valid(joi.ref("password"))
        .required()
        .messages({
            "any.required": "Confirm password is required",
            "any.only": "Passwords must match"
        }),

    phone: joi.string()
        .trim()
        .pattern(/^\+?\d{10,15}$/)
        .required()
        .messages({
            "any.required": "Phone is required",
            "string.pattern.base": "Invalid phone format"
        }),

    address: joi.string()
        .trim()
        .max(255)
        .optional(),

    role: joi.string()
        .trim()
        .valid("Admin", "Agent", "Maintenance_Center", "User")
        .optional()
        .messages({ "any.required": "Role is required" }),

    gender: joi.string()
        .trim()
        .valid("male", "female", "other")
        .required()
        .messages({ "any.required": "Gender is required" }),

    age: joi.number()
        .integer()
        .min(18)
        .max(100)
        .required()
        .messages({ "any.required": "Age is required" }),

    location: joi.string()
        .trim()
        .max(255)
        .required()
        .messages({ "any.required": "Location is required" }),
});

export const loginSchema = joi.object({
    identifier: joi.alternatives().try(
        joi.string().trim().email({ tlds: { allow: ["com", "net"] } }), 
        joi.string().trim().pattern(/^\d{10,15}$/) 
    ).required(),
    password: joi.string().required()
});
