import { createSocket } from "node:dgram";

const socket = createSocket("udp4");

socket.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  socket.close();
});

socket.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

socket.on("listening", () => {
  const address = socket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

socket.bind(32101, () => {
  console.log("Joining 238.0.0.18");
  socket.setMulticastInterface("192.168.86.64");

  socket.addMembership("238.0.0.18");
});
