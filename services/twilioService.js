const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {

  try {

    const result =
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

    console.log(
      "SMS Sent:",
      result.sid
    );

  } catch (err) {

    console.log(
      "SMS Error:",
      err.message
    );

  }

}

async function makeCall(to, message) {

  try {

    const call =
      await client.calls.create({

        to,

        from:
          process.env.TWILIO_PHONE_NUMBER,

        twiml:
          `<Response>
             <Say>
               ${message}
             </Say>
           </Response>`

      });

    console.log(
      "CALL SENT:",
      call.sid
    );

  } catch (err) {

    console.log(
      "CALL ERROR:",
      err.message
    );

  }

}

module.exports = {
  sendSMS,
  makeCall
};