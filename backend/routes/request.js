const express = require('express');
const router = express.Router();

// Basic health check for requests routes
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'requests', status: 'ok' });
});

module.exports = router;
