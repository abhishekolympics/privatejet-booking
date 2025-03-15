// server.js - Main server file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Load env variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/aviapages', require('./routes/aviapages'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/empty-legs', require('./routes/emptyLegs'));
app.use('/api/prices', require('./routes/prices.js'));

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => logger.info('MongoDB Connected'))
  .catch((err) => {
    logger.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));