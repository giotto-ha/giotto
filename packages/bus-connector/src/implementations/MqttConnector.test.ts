import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { MqttClient, connectAsync } from "mqtt";
import { MqttConnector } from "./MqttConnector.js";

const delayedExpectation = async (fn: () => Promise<void>) => {
  await new Promise<void>((res, rej) =>
    setTimeout(async () => {
      try {
        await fn();
        res();
      } catch (e) {
        rej(e);
      }
    }, 1000)
  );
};

describe("MqttConnector", () => {
  let testClient: MqttClient;
  let connector: MqttConnector;

  beforeEach(async () => {
    testClient = await connectAsync("mqtt://test.mosquitto.org:1883");
    connector = new MqttConnector({
      url: "mqtt://test.mosquitto.org:1883",
    });
  });

  afterEach(async () => {
    await testClient.endAsync();
    await connector.close();
  });

  it("should be a class", () => {
    expect(MqttConnector).toBeInstanceOf(Function);
  });

  it("should be instantiable", () => {
    expect(connector).toBeInstanceOf(MqttConnector);
  });

  it("listens to MQTT topics", async () => {
    await connector.awaitConnection();
    const handler = jest.fn();

    await connector.listenTo("giotto:test", handler);
    testClient.publish("giotto:test", '{"type":"test","signature":"test"}');
    await delayedExpectation(async () => {
      expect(handler).toBeCalledWith({ type: "test", signature: "test" });
    });
  });

  it("publishes to MQTT topics", async () => {
    await connector.awaitConnection();

    const awaitingMessage = testClient.subscribeAsync("giotto:test").then(
      () =>
        new Promise<void>((resolve, reject) => {
          testClient.on("message", (topic, message) => {
            if (topic !== "giotto:test") return;
            try {
              expect(message.toString()).toEqual(
                '{"type":"test","signature":"test"}'
              );
              resolve();
            } catch (e) {
              reject(e);
            }
          });

          connector.sendMessage("giotto:test", {
            type: "test",
            signature: "test",
          });
        })
    );

    return awaitingMessage;
  });

  it("can stop listening to MQTT topics", async () => {
    await connector.awaitConnection();
    const handler = jest.fn();

    await connector.listenTo("giotto:test", handler);
    testClient.publish("giotto:test", '{"type":"test","signature":"test"}');
    await delayedExpectation(async () => {
      expect(handler).toBeCalledWith({ type: "test", signature: "test" });
    });

    await connector.stopListeningTo("giotto:test");
    testClient.publish("giotto:test", '{"type":"test","signature":"test"}');
    await delayedExpectation(async () => {
      expect(handler).toBeCalledTimes(1);
    });
  });

  it("ignores non-bus messages", async () => {
    await connector.awaitConnection();
    const handler = jest.fn();

    await connector.listenTo("giotto:test", handler);
    testClient.publish("giotto:test", '"nope"');
    await delayedExpectation(async () => {
      expect(handler).toBeCalledTimes(0);
    });
  });
});
