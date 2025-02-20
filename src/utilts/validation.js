import joi from 'joi';







export const commonSchema = {
    name: joi.string(),
    email: joi.string(),
    password: joi.string(),
    confirmPassword: joi.string(),
    phone: joi.string(),
    ddress: joi.string(),
    role: joi.string(),
    gender: joi.string(),
    age: joi.number(),
    location: joi.string()
}

export const validation = (schema) => {
    return (req, res, next) => {

        const paramValidation = schema.params ? schema.params.validate(req.params, { abortEarly: false }) : { error: null };
        const bodyValidation = schema.body ? schema.body.validate(req.body, { abortEarly: false }) : { error: null };
        if (paramValidation.error || bodyValidation.error) {
            return res.status(400).json({
                message: "Validation error",
                details: [
                    ...(paramValidation.error ? paramValidation.error.details : []),
                    ...(bodyValidation.error ? bodyValidation.error.details : [])
                ]
            });
        }
        return next();
    };
};
