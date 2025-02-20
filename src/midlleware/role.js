import userModel from "../database/model/user.model.js";
import { AppError } from "../errorHandling/AppError.js";

export const checkRole = (...roles) => async (req, res, next) => {
    try {        
        
        let userId = req.user.id;
        let user = await userModel.findById(userId);
        if (!roles.includes(user.role)) {
            res.status(403).json({ message: "You are not authorized to perform this action" });
            throw new AppError("You are not authorized to perform this action", 403);
        }
        next();
    } catch (error) {
        next(error); 
    }
};
