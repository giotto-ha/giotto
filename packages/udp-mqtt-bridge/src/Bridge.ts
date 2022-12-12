import { connect as mqttConnect, MqttClient } from "mqtt";
import { MulticastGroup } from "./MulticastGroup.js";

export class Bridge<M extends {}> {
  private _bus: MqttClient;
  private _group: MulticastGroup<M>;
  private _connected: boolean = false;

  constructor(public group: MulticastGroup<M>, public busIp: string) {
    this._bus = mqttConnect(`mqtt://${busIp}`);
    this._group = group;
    console.log(this._bus);
  }

  connect(): void {
    if (this._connected) {
      return;
    }

    const groupConnected = this._group.connect();
    this._group.on("message", (msg: M, rinfo: string) => {
      this._bus.publish("udp", JSON.stringify({ msg, rinfo }));
    });

    this._bus.on("message", (topic: string, message: Buffer) => {
      if (topic === "udp") {
        const msg = JSON.parse(message.toString());
        this._group.sendMessage(msg.msg, msg.rinfo);
      }
    });

    this._bus.on("connect", async () => {
      await groupConnected;
      this._connected = true;
    });
  }
}
