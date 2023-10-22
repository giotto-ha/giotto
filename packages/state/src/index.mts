import { MongoClient } from "mongodb";
// import { Things } from "./data-sources/thing-data-source.mjs";
import { logger } from "./logger.mjs";

const { MONGO_USERNAME = "", MONGO_PASSWORD = "" } = process.env;

const clusterUrl = "127.0.0.1:27017";
const username = encodeURIComponent(MONGO_USERNAME);
const password = encodeURIComponent(MONGO_PASSWORD);
const authMechanism = "DEFAULT";

const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(uri);
// const dbName = "giotto";
client.connect().then(() => {
  logger.info("Connected to MongoDB");
});

// const dataSources = {
//   things: new Things(client.db(dbName).collection('things')),
// }



