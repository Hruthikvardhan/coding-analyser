require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const analyseRoutes = require('./routes/analyseRoutes');
const profileRoutes = require('./routes/profileRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// --- Core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Coding Profile Analyser API is running' });
});

// --- Routes ---
app.use('/api/analyse', analyseRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/stats', statsRoutes);

// --- 404 + error handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
