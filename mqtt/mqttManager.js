const mqtt = require("mqtt");

const lastSeen = {};

const {
    readJson,
    writeJson
} = require("../utils/fileStorage");

const {
    createAlert
} = require("../services/alertService");

const SensorData =
require("../models/SensorData");

const clients = {};
const offlineAlerted = {};


// =========================
// START ALL DEVICES
// =========================

async function startMQTT() {

    const Device =
        require("../models/Device");

    const devices =
        await Device.find();

    devices.forEach(device => {

        subscribeDevice(device);

    });

}

// =========================
// SUBSCRIBE SINGLE DEVICE
// =========================

function subscribeDevice(device) {

    if (
        clients[
        device.deviceId
        ]
    ) {

        console.log(
            `${device.deviceId} already subscribed`
        );

        return;
    }

    const brokerUrl =
        `mqtt://${device.broker}:${device.port}`;

    console.log(
        `Connecting ${device.deviceId}`
    );

    const client =
        mqtt.connect(brokerUrl);

    client.on("connect", () => {

        console.log(
            `${device.deviceId} Connected`
        );

        client.subscribe(
            device.topic,
            (err) => {

                if (err) {

                    console.log(
                        `Subscribe Error ${device.deviceId}`,
                        err
                    );

                    return;
                }

                console.log(
                    `Subscribed ${device.topic}`
                );

            }
        );

    });

    client.on(
        "message",
        async (topic, message) => {

            try {

                const payload =
                    JSON.parse(
                        message.toString()
                    );

                lastSeen[device.deviceId] =
                    Date.now();

                console.log(
                    device.deviceId,
                    payload
                );
                lastSeen[
                    device.deviceId
                ] = Date.now();

                offlineAlerted[
                    device.deviceId
                ] = false;

                saveLiveData(
                    device.deviceId,
                    payload
                );

                await saveHistory(
    device.deviceId,
    payload
);

                await checkThresholds(
                    device.deviceId,
                    payload
                );

            } catch (err) {

                console.log(
                    "MQTT Message Error",
                    err
                );

            }


        }
    );

    client.on(
        "error",
        (err) => {

            console.log(
                `${device.deviceId} MQTT Error`,
                err.message
            );

        }
    );

    clients[
        device.deviceId
    ] = client;

}

// =========================
// REMOVE DEVICE
// =========================

function unsubscribeDevice(
    deviceId
) {

    const client =
        clients[deviceId];

    if (!client)
        return;

    client.end(true);

    delete clients[
        deviceId
    ];

    console.log(
        `${deviceId} disconnected`
    );

}

// =========================
// THRESHOLDS
// =========================

async function checkThresholds(
    deviceId,
    payload
) {

    const Threshold =
        require("../models/Threshold");

    const config =
        await Threshold.findOne({
            deviceId
        });



    if (!config)
        return;

    if (
        config.IR_max !== undefined &&
        payload.IR < config.IR_max
    ) {

        await createAlert(
            deviceId,
            "IR below threshold",
            payload.IR,
            config.IR_max
        );

    }

    if (
        config.IY_max !== undefined &&
        payload.IY < config.IY_max
    ) {

        await createAlert(
            deviceId,
            "IY below threshold",
            payload.IY,
            config.IY_max
        );

    }

    if (
        config.IB_max !== undefined &&
        payload.IB < config.IB_max
    ) {

        await createAlert(
            deviceId,
            "IB below threshold",
            payload.IB,
            config.IB_max
        );

    }

}

// =========================
// LIVE DATA
// =========================

function saveLiveData(
    deviceId,
    payload
) {

    let liveData =
        readJson("./liveData.json");

    if (
        typeof liveData !== "object" ||
        Array.isArray(liveData)
    ) {

        liveData = {};

    }

    liveData[deviceId] = {

        ...payload,

        timestamp:
            Date.now()

    };

    writeJson(
        "./liveData.json",
        liveData
    );

}

// =========================
// HISTORY
// =========================

async function saveHistory(
    deviceId,
    payload
) {

    try {

        await SensorData.create({

            deviceId,

            ...payload,

            timestamp:
                Date.now()

        });

    } catch (err) {

        console.log(
            "History Save Error",
            err
        );

    }

}
function startOfflineMonitor() {

    setInterval(() => {

        const now =
            Date.now();

        Object.keys(
            lastSeen
        ).forEach(deviceId => {

            const diff =
                now -
                lastSeen[
                deviceId
                ];

            if (
                diff > 60000 &&
                !offlineAlerted[deviceId]
            ) {

                offlineAlerted[
                    deviceId
                ] = true;

                createAlert(
                    deviceId,
                    "Device Offline",
                    diff,
                    60000
                );

            }

        });

    }, 10000);

}

module.exports = {
    startMQTT,
    subscribeDevice,
    unsubscribeDevice,
    startOfflineMonitor
};