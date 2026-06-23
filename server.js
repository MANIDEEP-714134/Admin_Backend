console.log("SERVER STARTED");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const deviceRoutes = require("./routes/devices");
const {
  startMQTT,
  startOfflineMonitor
} = require(
  "./mqtt/mqttManager"
);

const connectDB =
require("./config/db");

connectDB();

const dataRoutes =
require("./routes/data");

const thresholdRoutes =
require("./routes/thresholds");

const alertRoutes =
require("./routes/alerts");

const guardianRoutes =
require("./routes/guardians");


app.use(cors());
app.use(express.json());

app.use("/api/devices", deviceRoutes);

app.use(
  "/api",
  dataRoutes
);

app.get("/", (req, res) => {
  res.json({
    status: "Backend Running"
  });
});

app.use(
  "/api/thresholds",
  thresholdRoutes
);  

app.use(
  "/api/alerts",
  alertRoutes
);

app.use(
  "/api/guardians",
  guardianRoutes
);



const {
  makeCall
} = require("./services/twilioService");

app.get("/test-call", async (req, res) => {

    
  await makeCall(
    "+919866641249",
    "PMS Alert. This is a test call."
  );

  res.json({
    success: true
  });

});


const { sendSMS } =
require("./services/twilioService");

app.get(
  "/test-sms",
  async (req, res) => {

    await sendSMS(
      "+919866641249",
      "PMS Alert Test"
    );

    res.json({
      success: true
    });

});

const PORT = 5000;

startMQTT();
startOfflineMonitor();

console.log(
  "SID:",
  process.env.TWILIO_ACCOUNT_SID
);

console.log(
  "PHONE:",
  process.env.TWILIO_PHONE_NUMBER
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});