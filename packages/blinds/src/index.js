"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = require("node:dgram");
const node_util_1 = require("node:util");
const node_crypto_1 = require("node:crypto");
const MULTICAST_ADDRESS = "238.0.0.18";
const { KEY = "" } = process.env;
const socket = (0, node_dgram_1.createSocket)("udp4");
socket.on("error", (err) => {
    console.log(`server error:\n${err.stack}`);
    socket.close();
});
socket.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    const message = JSON.parse(msg.toString());
    if (message.msgType === "GetDeviceListAck") {
        console.log(`token: ${message.token}`);
        message.data.forEach((device) => {
            console.log((0, node_util_1.inspect)(device));
        });
        const aes = (0, node_crypto_1.createCipheriv)("aes-128-ecb", KEY, Buffer.from(""));
        const AccessToken = Buffer.concat([aes.update(message.token), aes.final()])
            .toString("hex")
            .toUpperCase()
            .slice(0, 32);
        console.log(`AccessToken: ${AccessToken}`);
        message.data.forEach(({ mac, deviceType }) => {
            const upMsg = {
                msgType: "WriteDevice",
                mac,
                deviceType,
                AccessToken,
                msgID: getMessageId(),
                data: {
                    targetPosition: 0,
                },
            };
            socket.send(JSON.stringify(upMsg), 32100, MULTICAST_ADDRESS, (e, b) => {
                if (e) {
                    console.error(e);
                }
                else {
                    console.log(b);
                }
            });
        });
    }
});
socket.on("listening", () => {
    const address = socket.address();
    console.log(`server listening ${address.address}:${address.port}`);
});
const getMessageId = () => {
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}00`;
};
socket.bind(32101, () => {
    console.log(`Joining ${MULTICAST_ADDRESS}`);
    socket.addMembership(MULTICAST_ADDRESS);
    socket.setBroadcast(true);
    const message = {
        msgType: "GetDeviceList",
        msgID: getMessageId(),
    };
    console.log("Sending message");
    socket.send(JSON.stringify(message), 32100, MULTICAST_ADDRESS, (e, b) => {
        if (e) {
            console.error(e);
        }
        else {
            console.log(b);
        }
    });
});
