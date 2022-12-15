import { connect } from "mqtt";

const client = connect("mqtt://localhost:1883");
client.on("reconnect", () => {
  console.log("Reconnecting...");
});

setInterval(() => {
  if (client.connected) {
    const time = Date.now();
    client.publish("time", `${time}`);
    console.log(`Sent ${time}`);
  }
}, 1000);
