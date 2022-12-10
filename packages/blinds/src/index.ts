import { createSocket } from "node:dgram";
import { inspect } from "node:util";
import { createCipheriv } from "node:crypto";

const MULTICAST_ADDRESS = "238.0.0.18";
const { KEY = "" } = process.env;

const socket = createSocket("udp4");

socket.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const message = JSON.parse(msg.toString());
  if (message.msgType === "GetDeviceListAck") {
    console.log(`token: ${message.token}`);
    message.data.forEach((device: unknown) => {
      console.log(inspect(device));
    });
    const aes = createCipheriv("aes-128-ecb", KEY, Buffer.from(""));
    const AccessToken = Buffer.concat([aes.update(message.token), aes.final()])
      .toString("hex")
      .toUpperCase()
      .slice(0, 32);
    console.log(`AccessToken: ${AccessToken}`);

    message.data.forEach(
      ({ mac, deviceType }: { mac: string; deviceType: string }) => {
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
          } else {
            console.log(b);
          }
        });
      }
    );
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
    } else {
      console.log(b);
    }
  });
});
