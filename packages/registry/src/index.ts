import 'reflect-metadata';

import { MongoClient } from "mongodb";
import { Registry, RegistryEntry } from "./Registry.js";
import {RegistryService} from "./RegistryService.js";
import { FifoConnector } from "@giotto/bus-connector/implementations/FifoConnector.js";

const { MONGO_USERNAME = "", MONGO_PASSWORD = "" } = process.env;

const clusterUrl = "192.168.64.2:27017";
const username = encodeURIComponent(MONGO_USERNAME);
const password = encodeURIComponent(MONGO_PASSWORD);
const authMechanism = "DEFAULT";

const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(uri);
const dbName = "giotto";
client.connect().then(() => {
  console.info("Connected to MongoDB");
});

const registryCollection = client.db(dbName).collection<RegistryEntry>('registry');
const registry = new Registry(registryCollection);


const service = new RegistryService(new FifoConnector('./registry.fifo'), registry)
service.start();
