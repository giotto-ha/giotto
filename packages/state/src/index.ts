import { MongoClient } from "mongodb";

const { MONGO_USERNAME = "", MONGO_PASSWORD = "" } = process.env;

const clusterUrl = "127.0.0.1:27017";
const username = encodeURIComponent(MONGO_USERNAME);
const password = encodeURIComponent(MONGO_PASSWORD);
const authMechanism = "DEFAULT";

const uri = `mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(uri);
const dbName = "giotto";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("things");

  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  // the following code examples can be pasted here...

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
