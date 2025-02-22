import jwt from 'jsonwebtoken'
import userModel from '../database/model/user.model.js';
import { AppError } from '../errorHandling/AppError.js';

export const auth = async (req, res, next) => {

    try {
        let { authorization } = req.headers
        if (!authorization) {
            res.json({ message: 'un autharized' })
            throw new AppError('un Autharized', 403)
        }
        let [bearear, token] = authorization.split(" ") || []
        let signature = ''
        if (bearear == process.env.ADMIN_BREAR) {
            signature = process.env.ADMIN_SIGNATURE
        } else if (bearear == process.env.AGENT_BEREAR) {
            signature = process.env.AGENT_SIGNATURE
        } else if (bearear == process.env.MC_BEARER) {
            signature = process.env.MC_SIGNATURE
        } else if (bearear == process.env.USER_BEREAR) {
            signature = process.env.USER_SIGNATURE
        } else {
            res.json({ message: 'un autharized' })
        }
        let decoded = jwt.verify(token, signature)
        if (!decoded) {
            throw new AppError('un autharized', 403)
        }
        let user = await userModel.findById(decoded.id)
        req.user = user
        next()
    } catch (error) {
        res.json({ message: 'un autharized' })
    }
}