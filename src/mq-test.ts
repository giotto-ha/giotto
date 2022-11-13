import { connect } from "mqtt";
import { inspect } from "util";

const client = connect("mqtt://localhost");

client.on("connect", function (packet) {
  console.log("Connected");
  console.log(inspect(packet));
  client.subscribe("presence", function (err) {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer
  console.log("Got message...");
  console.log(message.toString());
  client.end();
});
