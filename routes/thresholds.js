const express = require("express");
const router = express.Router();

const Threshold =
require("../models/Threshold");

// ======================
// GET THRESHOLDS
// ======================

router.get(
  "/:deviceId",
  async (req, res) => {

    try {

      const threshold =
        await Threshold.findOne({

          deviceId:
            req.params.deviceId

        });

      res.json(
        threshold || {}
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
// SAVE THRESHOLDS
// ======================

router.post(
  "/:deviceId",
  async (req, res) => {

    try {

      const {
        IR_max,
        IY_max,
        IB_max
      } = req.body;

      const deviceId =
        req.params.deviceId;

      await Threshold
        .findOneAndUpdate(

          {
            deviceId
          },

          {
            IR_max,
            IY_max,
            IB_max,
            updatedAt:
              Date.now()
          },

          {
            upsert: true,
            new: true
          }

        );

      res.json({

        success: true,

        message:
          "Threshold Saved"

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