const express = require("express");
const router = express.Router();

const {
  readJson,
  writeJson
} = require("../utils/fileStorage");

router.get("/", (req, res) => {

  const alerts =
    readJson("./alerts.json");

  res.json(alerts);

});

router.get("/:deviceId", (req, res) => {

  const { deviceId } =
    req.params;

  const alerts =
    readJson("./alerts.json");

  const filtered =
    alerts.filter(
      a =>
      a.deviceId === deviceId
    );

  res.json(filtered);

});

router.delete("/", (req, res) => {

  writeJson(
    "./alerts.json",
    []
  );

  res.json({
    success: true
  });

});

module.exports = router;