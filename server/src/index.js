const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initializeDatabase } = require('./db/init');
const weatherRoutes = require('./routes/weather');
const searchRoutes = require('./routes/search');
const thresholdRoutes = require('./routes/thresholds');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

const db = initializeDatabase();
app.locals.db = db;

app.use('/api/weather', weatherRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/thresholds', thresholdRoutes);

const clientBuildPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Weather Peril Portal server running on port ${PORT}`);
});

module.exports = app;
