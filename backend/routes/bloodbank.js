const express = require('express');
const router = express.Router();

// Basic health check for bloodbanks routes
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'bloodbanks', status: 'ok' });
});

module.exports = router;
