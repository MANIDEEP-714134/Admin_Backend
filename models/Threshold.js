const mongoose =
require("mongoose");

module.exports =
mongoose.model(
  "Threshold",
  new mongoose.Schema({

    deviceId: {
      type: String,
      unique: true
    },

    IR_max: Number,

    IY_max: Number,

    IB_max: Number,

    updatedAt: {
      type: Date,
      default: Date.now
    }

  })
);