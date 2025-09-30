const express = require('express');
const router = express.Router();

// Basic health check for donors routes
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'donors', status: 'ok' });
});

module.exports = router;
