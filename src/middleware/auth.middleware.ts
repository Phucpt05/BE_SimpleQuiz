import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/user.model'

// Extended Request interface to include user
export interface AuthRequest extends Request {
    user?: IUser
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        })
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'No user found with this id'
            })
        }

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        })
    }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.admin) {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: 'User is not authorized to perform this action'
        })
    }
}
