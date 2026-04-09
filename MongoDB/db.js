const mongoose = require('mongoose');
const { mongoURI } = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = { connectDB, mongoose };