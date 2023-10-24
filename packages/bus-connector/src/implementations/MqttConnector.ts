import { connectAsync, type MqttClient } from "mqtt";
import { BusConnector, BusMessage, isBusMessage } from "../BusConnector.js";
import debug from "debug";

const DEBUG = debug("giotto:bus-connector:mqtt");

export class MqttConnector implements BusConnector {
  private client: Promise<MqttClient>;
  private listeners: Map<string, Array<<T extends string>(message: BusMessage<T>) => void>> =
    new Map();

  constructor({ url }: { url?: string } = {}) {
    const mqttUrl = url ?? process.env["MQTT_URL"] ?? "";
    DEBUG(`Connecting to ${mqttUrl}`)
    this.client = connectAsync(mqttUrl);

    this.client.then((c) => {
      c.on('connect', () => DEBUG('Connected to MQTT broker'));
      c.on('connect', () => DEBUG('Disconnected from MQTT broker'));
      c.on("error", (e) => console.error(e));
      c.on("message", (topic, message) => {
        const messageAsString = message.toString();
        try {
          const parsedMessage = JSON.parse(messageAsString);
          if (isBusMessage(parsedMessage)) {
            this.listeners
              .get(topic)
              ?.forEach((callback) => callback(parsedMessage));
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.warn(
              `Could not parse message '${messageAsString}' on topic ${topic}`
            );
          } else {
            throw e;
          }
        }
      });
    });
  }

  async awaitConnection() {
    await this.client;
  }

  async close() {
    const client = await this.client;
    await client.endAsync();
  }

  async listenTo(topic: string, callback: <T extends string>(message: BusMessage<T>) => void) {
    const client = await this.client;
    if (!this.listeners.has(topic)) {
      await client.subscribeAsync(topic);
      this.listeners.set(topic, []);
    }
    this.listeners.get(topic)?.push(callback);
  }

  async stopListeningTo(topic: string) {
    const client = await this.client;
    client.unsubscribe(topic);
    this.listeners.delete(topic);
  }

  async sendMessage<T extends string>(topic: string, message: BusMessage<T>) {
    const client = await this.client;
    client.publish(topic, JSON.stringify(message));
  }
}
