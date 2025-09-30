const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory'); // Assuming Inventory model exists

// GET /api/inventory/search
// Query params: bloodGroup, lat, lon, radius (meters)
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, lat, lon, radius } = req.query;

    if (!bloodGroup || !lat || !lon) {
      return res.status(400).json({ success: false, message: 'Missing required query parameters' });
    }

    const maxDistance = radius ? parseInt(radius) : 10000; // default 10km

    const results = await Inventory.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          distanceField: "distance",
          maxDistance: maxDistance,
          spherical: true,
          query: { bloodGroup: bloodGroup, availableUnits: { $gt: 0 } }
        }
      },
      {
        $lookup: {
          from: 'bloodbanks',
          localField: 'bloodBankId',
          foreignField: '_id',
          as: 'bloodBank'
        }
      },
      { $unwind: "$bloodBank" },
      {
        $project: {
          bloodGroup: 1,
          availableUnits: 1,
          distance: 1,
          bloodBank: {
            name: 1,
            address: 1,
            phone: 1,
            coordinates: "$bloodBank.location.coordinates"
          }
        }
      }
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Inventory search error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
