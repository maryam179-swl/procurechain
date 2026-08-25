import mongoose from 'mongoose'

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/procurechain'
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    })
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
    return true
  } catch (err) {
    console.log(`⚠️ MongoDB connection unavailable (${err.message}). Using local JSON DB adapter cleanly.`)
    return false
  }
}
