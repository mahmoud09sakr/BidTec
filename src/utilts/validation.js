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
        console.log(schema);
        const paramValidation = schema.params ? schema.params.validate(req.params, { abortEarly: false }) : { error: null };
        const queryValidation = schema.query ? schema.query.validate(req.query, { abortEarly: false }) : { error: null };
        const bodyValidation = schema.body ? schema.body.validate(req.body, { abortEarly: false }) : { error: null };
        const errors = [
            ...(paramValidation.error ? paramValidation.error.details : []),
            ...(queryValidation.error ? queryValidation.error.details : []),
            ...(bodyValidation.error ? bodyValidation.error.details : [])
        ];
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation error",
                details: errors.map(err => err.message)
            });
        }
        return next();
    };
};
