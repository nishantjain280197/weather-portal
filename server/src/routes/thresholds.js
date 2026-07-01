const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const thresholds = db.prepare('SELECT * FROM peril_thresholds').all();
    res.json(thresholds);
  } catch (error) {
    console.error('Get thresholds error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve thresholds.' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { low_max, moderate_max, high_max } = req.body;

    db.prepare(
      'UPDATE peril_thresholds SET low_max = ?, moderate_max = ?, high_max = ? WHERE id = ?'
    ).run(low_max, moderate_max, high_max, req.params.id);

    db.prepare(
      'INSERT INTO audit_log (action, details) VALUES (?, ?)'
    ).run('threshold_update', JSON.stringify({ id: req.params.id, low_max, moderate_max, high_max }));

    const threshold = db.prepare('SELECT * FROM peril_thresholds WHERE id = ?').get(req.params.id);
    res.json(threshold);
  } catch (error) {
    console.error('Update threshold error:', error.message);
    res.status(500).json({ error: 'Failed to update threshold.' });
  }
});

module.exports = router;
