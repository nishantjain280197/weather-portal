const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const searches = db.prepare(
      'SELECT * FROM searches ORDER BY created_at DESC LIMIT 20'
    ).all();
    res.json(searches);
  } catch (error) {
    console.error('Get searches error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve search history.' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { address, latitude, longitude, search_date, risk_summary } = req.body;

    if (!address || !latitude || !longitude || !search_date) {
      return res.status(400).json({ error: 'address, latitude, longitude, and search_date are required' });
    }

    const result = db.prepare(
      'INSERT INTO searches (address, latitude, longitude, search_date, risk_summary) VALUES (?, ?, ?, ?, ?)'
    ).run(address, latitude, longitude, search_date, risk_summary || null);

    db.prepare(
      'INSERT INTO audit_log (action, details) VALUES (?, ?)'
    ).run('search', JSON.stringify({ address, latitude, longitude, search_date }));

    const search = db.prepare('SELECT * FROM searches WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(search);
  } catch (error) {
    console.error('Save search error:', error.message);
    res.status(500).json({ error: 'Failed to save search.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM searches WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete search error:', error.message);
    res.status(500).json({ error: 'Failed to delete search.' });
  }
});

module.exports = router;
