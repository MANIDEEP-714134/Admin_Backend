const { sendSMS, makeCall } = require("./twilioService");

const Alert = require("../models/Alert");
const Guardian = require("../models/Guardian");

const lastAlerts = {};

async function createAlert(
  deviceId,
  message,
  value,
  limit
) {

  console.log("\n========================================");
  console.log("CREATE ALERT STARTED");
  console.log("Device   :", deviceId);
  console.log("Message  :", message);
  console.log("Value    :", value);
  console.log("Limit    :", limit);
  console.log("========================================");

  const key = `${deviceId}_${message}`;
  const now = Date.now();

  // 5 minute cooldown
  if (
    lastAlerts[key] &&
    now - lastAlerts[key] < 300000
  ) {

    console.log("Cooldown Active - Alert Skipped");
    return;

  }

  lastAlerts[key] = now;

  // Save alert
  try {

    await Alert.create({

      deviceId,
      message,
      value,
      limit,
      timestamp: now

    });

    console.log("Alert saved to MongoDB");

  } catch (err) {

    console.log("MongoDB Alert Save Error:", err.message);

  }

  console.log(`ALERT: ${deviceId} ${message}`);

  // ===========================
  // Read Guardians from MongoDB
  // ===========================

  let list = [];

  try {

    list = await Guardian.find({ deviceId });

    console.log("\nGuardians Loaded From MongoDB");
    console.log("Device ID :", deviceId);
    console.log("Guardians Found :", list.length);
    console.log(list);

  } catch (err) {

    console.log("Guardian Fetch Error:", err.message);
    return;

  }

  if (list.length === 0) {

    console.log("No guardians configured for this device.");
    return;

  }

  // ===========================
  // Send SMS + Call
  // ===========================

  for (const g of list) {

    console.log("\n--------------------------------");
    console.log("Processing Guardian");
    console.log("Name   :", g.name);
    console.log("Mobile :", g.mobile);
    console.log("--------------------------------");

    const smsMessage = `${deviceId}
${message}
Value : ${value}
Limit : ${limit}`;

    // SMS

    console.log("Sending SMS...");

    try {

      await sendSMS(
        g.mobile,
        smsMessage
      );

      console.log("SMS SUCCESS");

    } catch (err) {

      console.log("SMS FAILED");
      console.log(err.message);

    }

    // CALL

    console.log("Making Call...");

    try {

      await makeCall(
        g.mobile,
        `${deviceId}. ${message}`
      );

      console.log("CALL SUCCESS");

    } catch (err) {

      console.log("CALL FAILED");
      console.log(err.message);

    }

  }

  console.log("\nAlert Processing Completed");
  console.log("========================================\n");

}

module.exports = {
  createAlert
};