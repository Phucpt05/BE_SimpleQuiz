import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    username: string
    email: string
    password: string
    admin: boolean
    comparePassword(password: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            default: ''
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false // Don't return password by default
        },
        admin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

// Hash password before saving
UserSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password')) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
