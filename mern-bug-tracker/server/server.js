require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bugRoutes = require('./routes/bugRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database

  connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/bugs', bugRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.log(`Error: ${err.message}`);
//   server.close(() => process.exit(1));
// });

module.exports = app;