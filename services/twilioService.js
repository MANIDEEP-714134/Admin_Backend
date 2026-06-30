const twilio = require("twilio");

console.log("========== TWILIO SERVICE INITIALIZED ==========");
console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
console.log(
  "TOKEN:",
  process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing"
);
console.log("PHONE:", process.env.TWILIO_PHONE_NUMBER);
console.log("===============================================");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// ======================
// SEND SMS
// ======================

async function sendSMS(to, message) {

  console.log("\n========== SMS REQUEST ==========");
  console.log("To      :", to);
  console.log("Message :", message);

  try {

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log("✅ SMS SENT SUCCESSFULLY");
    console.log("SID      :", result.sid);
    console.log("Status   :", result.status);
    console.log("===============================\n");

    return result;

  } catch (err) {

    console.log("❌ SMS FAILED");
    console.log("Message :", err.message);

    if (err.code)
      console.log("Code    :", err.code);

    if (err.moreInfo)
      console.log("MoreInfo:", err.moreInfo);

    console.log("===============================\n");

    throw err;

  }

}

// ======================
// MAKE CALL
// ======================

async function makeCall(to, message) {

  console.log("\n========== CALL REQUEST ==========");
  console.log("To      :", to);
  console.log("From    :", process.env.TWILIO_PHONE_NUMBER);
  console.log("Message :", message);

  try {

    const call = await client.calls.create({

      to,

      from: process.env.TWILIO_PHONE_NUMBER,

      twiml: `
        <Response>
          <Say voice="alice">
            ${message}
          </Say>
        </Response>
      `

    });

    console.log("✅ CALL CREATED SUCCESSFULLY");
    console.log("SID       :", call.sid);
    console.log("Status    :", call.status);
    console.log("Direction :", call.direction);
    console.log("===============================\n");

    return call;

  } catch (err) {

    console.log("❌ CALL FAILED");
    console.log("Message :", err.message);

    if (err.code)
      console.log("Code    :", err.code);

    if (err.moreInfo)
      console.log("MoreInfo:", err.moreInfo);

    console.log("===============================\n");

    throw err;

  }

}

module.exports = {
  sendSMS,
  makeCall
};