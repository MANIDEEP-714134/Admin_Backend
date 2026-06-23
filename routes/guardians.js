const express = require("express");
const router = express.Router();

const Guardian =
require("../models/Guardian");

// ======================
// GET GUARDIANS
// ======================

router.get(
  "/:deviceId",
  async (req, res) => {

    try {

      const guardians =
        await Guardian.find({

          deviceId:
            req.params.deviceId

        });

      res.json(
        guardians
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
// ADD GUARDIAN
// ======================

router.post(
  "/:deviceId",
  async (req, res) => {

    try {

      const {
        name,
        mobile
      } = req.body;

      const guardian =
        await Guardian.create({

          deviceId:
            req.params.deviceId,

          name,
          mobile

        });

      res.json({
        success: true,
        guardian
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message
      });

    }

  }
);

// ======================
// DELETE GUARDIAN
// ======================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      await Guardian
        .findByIdAndDelete(
          req.params.id
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