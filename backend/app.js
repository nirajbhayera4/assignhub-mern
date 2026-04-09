const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars for local development. On Vercel, production env vars come
// from the project settings and are already present in process.env.
dotenv.config({ path: path.join(__dirname, '.env') });

// Reuse the same connection across serverless invocations when possible.
connectDB();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Check your MongoDB connection and try again.'
    });
  }

  next();
});

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'API is running...' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/bids', require('./routes/bids'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));

module.exports = app;
