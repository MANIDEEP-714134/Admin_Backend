const mongoose =
require("mongoose");

module.exports =
mongoose.model(
  "Alert",
  new mongoose.Schema({

    deviceId: String,

    message: String,

    value: Number,

    limit: Number,

    timestamp: {
      type: Date,
      default: Date.now
    }

  })
);