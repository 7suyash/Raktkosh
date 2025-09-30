const express = require('express');
const router = express.Router();

// Basic health check for inventory routes
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'inventory', status: 'ok' });
});

module.exports = router;
