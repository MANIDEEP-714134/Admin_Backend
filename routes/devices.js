const express = require("express");
const router = express.Router();

const Device =
  require("../models/Device");

const {
  subscribeDevice,
  unsubscribeDevice
} = require("../mqtt/mqttManager");

// ======================
// GET ALL DEVICES
// ======================

router.get("/", async (req, res) => {

  try {

    const devices =
      await Device.find();

    res.json(devices);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

// ======================
// ADD DEVICE
// ======================

router.post("/", async (req, res) => {

  try {

    const {
      deviceId,
      broker,
      port,
      topic
    } = req.body;

    const existing =
      await Device.findOne({
        deviceId
      });

    if (existing) {

      return res.status(400).json({
        success: false,
        message:
          "Device already exists"
      });

    }

    const device =
      await Device.create({

        deviceId,
        broker,
        port,
        topic

      });

    subscribeDevice({
      deviceId,
      broker,
      port,
      topic
    });

    res.json({
      success: true,
      device
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

// ======================
// DELETE DEVICE
// ======================

router.delete(
  "/:deviceId",
  async (req, res) => {

    try {

      const {
        deviceId
      } = req.params;

      await Device.deleteOne({
        deviceId
      });

      unsubscribeDevice(
        deviceId
      );

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