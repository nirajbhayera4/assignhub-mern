const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('Running without database connection');
    }
  }
};

module.exports = connectDB;