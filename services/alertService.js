const { sendSMS, makeCall } =
require("./twilioService");

const Alert =
require("../models/Alert");

const {
  readJson
} = require("../utils/fileStorage");

const lastAlerts = {};

async function createAlert(
  deviceId,
  message,
  value,
  limit
) {

  const key =
    `${deviceId}_${message}`;

  const now =
    Date.now();

  // 5 minute cooldown

  if (
    lastAlerts[key] &&
    now - lastAlerts[key] < 300000
  ) {

    return;

  }

  lastAlerts[key] = now;

  // Save Alert to MongoDB

  await Alert.create({

    deviceId,
    message,
    value,
    limit,
    timestamp: now

  });

  console.log(
    "ALERT:",
    deviceId,
    message
  );

  // Read Guardians
  // (Still JSON for now)

  const guardians =
    readJson("./guardians.json");

  const list =
    guardians[deviceId] || [];

  for (const g of list) {

    const smsMessage =
`${deviceId}
${message}
Value: ${value}
Limit: ${limit}`;

    // SMS

    try {

      await sendSMS(
        g.mobile,
        smsMessage
      );

      console.log(
        `SMS sent to ${g.mobile}`
      );

    } catch (err) {

      console.log(
        "SMS Error:",
        err.message
      );

    }

    // CALL

    try {

      await makeCall(
        g.mobile,
        `${deviceId}. ${message}`
      );

      console.log(
        `Call placed to ${g.mobile}`
      );

    } catch (err) {

      console.log(
        "Call Error:",
        err.message
      );

    }

  }

}

module.exports = {
  createAlert
};