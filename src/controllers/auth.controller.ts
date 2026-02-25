import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'

const generateToken = (id: string) => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign({ id }, secret, {
        expiresIn: (process.env.JWT_EXPIRE as any) || '7d'
    })
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, admin } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            })
        }

        const user = await User.create({
            username: username || '',
            email,
            password,
            admin
        })

        const token = generateToken(user._id as string)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    admin: user.admin
                },
                token
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }

        // Include password because it's set to select: false in model
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = generateToken(user._id as string)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    admin: user.admin
                },
                token
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        })
    }
}

export const promoteAdmin = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.admin = true
        await user.save()

        res.status(200).json({
            success: true,
            message: 'User promoted to admin successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                admin: user.admin
            }
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Server error during promotion',
            error: error.message
        })
    }
}
