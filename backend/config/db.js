const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    // Attempt standard MongoDB connection
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental-app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // In serverless environments like Vercel, we shouldn't use mongodb-memory-server
    // because it requires a writable filesystem and downloads large binaries.
    console.warn("Starting without database. APIs will fail, but static files will still be served.");
  }
};

module.exports = connectDB;
