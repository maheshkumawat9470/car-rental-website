const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = async () => {
  try {
    // Attempt standard MongoDB connection first
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental-app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Standard MongoDB not found locally. Starting embedded persistent MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      
      const dbPath = path.join(__dirname, '../mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const mongoServer = await MongoMemoryServer.create({
        instance: {
          port: 27018, // Use different port to avoid conflicts
          dbPath: dbPath,
          storageEngine: 'wiredTiger' // Needed for persistence
        }
      });
      
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`Embedded MongoDB Connected successfully! Persistent data stored at: ${dbPath}`);
    } catch (embeddedError) {
      console.error(`Error starting embedded MongoDB: ${embeddedError.message}`);
      console.warn("Starting without database. APIs will fail, but static files will still be served.");
    }
  }
};

module.exports = connectDB;
