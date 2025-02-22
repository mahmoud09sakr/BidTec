import jwt from 'jsonwebtoken';
import userModel from '../database/model/user.model.js';
import { AppError } from '../errorHandling/AppError.js';

export const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        // Check if authorization header exists
        if (!authorization) {
            return next(new AppError('Unauthorized: No token provided', 403));
        }

        // Split bearer and token
        const [bearer, token] = authorization.split(" ") || [];
        if (!bearer || !token) {
            return next(new AppError('Unauthorized: Invalid token format', 403));
        }

        // Determine signature based on bearer type
        let signature;
        if (bearer === process.env.ADMIN_BREAR) {
            signature = process.env.ADMIN_SIGNATURE;
        } else if (bearer === process.env.AGENT_BEREAR) {
            signature = process.env.AGENT_SIGNATURE;
        } else if (bearer === process.env.MC_BEARER) {
            signature = process.env.MC_SIGNATURE;
        } else if (bearer === process.env.USER_BEREAR) {
            signature = process.env.USER_SIGNATURE;
        } else {
            return next(new AppError('Unauthorized: Invalid bearer type', 403));
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, signature);
        } catch (jwtError) {
            return next(new AppError('Unauthorized: Invalid or expired token', 403));
        }

        if (!decoded || !decoded.id) {
            return next(new AppError('Unauthorized: Invalid token payload', 403));
        }

        // Fetch user from database
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return next(new AppError('Unauthorized: User not found', 403));
        }

        // Attach user to request and proceed
        req.user = user;
        next();
    } catch (error) {
        // Catch any unexpected errors (e.g., database connection issues)
        return next(new AppError('Unauthorized: Authentication failed', 403));
    }
};