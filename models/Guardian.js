const mongoose =
require("mongoose");

module.exports =
mongoose.model(
  "Guardian",
  new mongoose.Schema({

    deviceId: String,

    name: String,

    mobile: String

  })
);