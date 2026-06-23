const mongoose =
require("mongoose");

module.exports =
mongoose.model(
  "SensorData",
  new mongoose.Schema({

    deviceId: String,

    IR: Number,

    IY: Number,

    IB: Number,

    status: String,

    timestamp: {
      type: Date,
      default: Date.now
    }

  })
);