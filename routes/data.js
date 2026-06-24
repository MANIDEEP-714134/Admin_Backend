const express = require("express");
const router = express.Router();

const SensorData =
require("../models/SensorData");

// ======================
// LIVE DATA
// ======================

router.get(
  "/live/:deviceId",
  async (req, res) => {

    try {

      const data =
        await SensorData
          .findOne({

            deviceId:
              req.params.deviceId

          })
          .sort({
            timestamp: -1
          });

      res.json(
        data || {}
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

// ======================
// HISTORY
// ======================

router.get("/history/:deviceId", async (req, res) => {
  try {

    const days = parseInt(req.query.days) || 2;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await SensorData.find({
      deviceId: req.params.deviceId,
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: 1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;