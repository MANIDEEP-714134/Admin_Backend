const express = require("express");
const router = express.Router();

const Alert =
require("../models/Alert");

// ======================
// GET ALL ALERTS
// ======================

router.get(
  "/",
  async (req, res) => {

    try {

      const alerts =
        await Alert.find()
          .sort({
            timestamp: -1
          });

      res.json(alerts);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

// ======================
// GET DEVICE ALERTS
// ======================

router.get(
  "/:deviceId",
  async (req, res) => {

    try {

      const alerts =
        await Alert.find({

          deviceId:
            req.params.deviceId

        })
        .sort({
          timestamp: -1
        });

      res.json(alerts);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

// ======================
// DELETE ALL ALERTS
// ======================

router.delete(
  "/",
  async (req, res) => {

    try {

      await Alert.deleteMany({});

      res.json({
        success: true
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

module.exports = router;