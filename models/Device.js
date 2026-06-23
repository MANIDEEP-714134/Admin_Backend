const mongoose =
require("mongoose");

module.exports =
mongoose.model(
    "Device",
    new mongoose.Schema({

        deviceId: String,

        broker: String,

        port: Number,

        topic: String,

        createdAt: {
            type: Date,
            default: Date.now
        }

    })
);