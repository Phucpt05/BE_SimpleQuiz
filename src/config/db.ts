import mongoose from "mongoose"

const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI

    if (!uri) {
        console.error('ERROR: MONGO_URI is not defined in environment variables.')
        process.exit(1)
    }

    try {
        await mongoose.connect(uri)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

export default connectDB 