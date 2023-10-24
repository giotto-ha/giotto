import { MqttConnector } from "@giotto/bus-connector/implementations/MqttConnector.js";
import { getKeys } from "@giotto/message-integrity/get-keys.js";
import { Configurator } from "./Configurator.js";
import { InMemoryKeyStore } from "@giotto/message-integrity/key-stores/InMemoryKeyStore.js";

const configurator =  new Configurator(
    process.env['SERVICE_UUID'] ?? "00000000-0000-0000-0000-000000000000",
    new MqttConnector(),
    await getKeys(),
    new InMemoryKeyStore()
);

configurator.start();