import "reflect-metadata";

import { MongoClient } from "mongodb";
import { Registry, RegistryEntry } from "./Registry.js";
import { RegistryService } from "./RegistryService.js";
import { MqttConnector } from "@giotto/bus-connector/implementations/MqttConnector.js";
import { randomUUID } from "node:crypto";
import debug from "debug";

const DEBUG = debug("giotto:registry");

const {
  MONGO_USERNAME = "",
  MONGO_PASSWORD = "",
  MONGO_URL = "localhost:27017",
} = process.env;

const clusterUrl = MONGO_URL;
const username = encodeURIComponent(MONGO_USERNAME);
const password = encodeURIComponent(MONGO_PASSWORD);
const authMechanism = "DEFAULT";

const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(uri);
const dbName = "giotto";
client.connect().then(() => {
  DEBUG("Connected to MongoDB");
});

const registryCollection = client
  .db(dbName)
  .collection<RegistryEntry>("registry");
const registry = new Registry(registryCollection);
const uuid = randomUUID();

const service = new RegistryService(new MqttConnector(), registry, uuid);
service.start();
