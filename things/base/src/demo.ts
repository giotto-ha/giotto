import { MqttConnector } from "@giotto/bus-connector/implementations/MqttConnector.js";
import { getKeys } from "@giotto/message-integrity/get-keys.js";
import { importJwk } from "@giotto/message-integrity/jwks.js";
import { InMemoryKeyStore } from "@giotto/message-integrity/key-stores/InMemoryKeyStore.js";
import { BaseProvider } from "./BaseProvider.js";
import { BaseThing } from "./BaseThing.js";
import { UUID } from "./things.js";

class DemoProvider extends BaseProvider {}
class DemoThing extends BaseThing<{
  test: number;
}> {
  configuration = {};
}

const thingKeyStore = new InMemoryKeyStore();
const providerKeyStore = new InMemoryKeyStore<UUID>();
const keySet = await getKeys();
const provider = new DemoProvider(thingKeyStore, providerKeyStore, keySet);

const publicJwk =
  '{"key_ops":["verify"],"ext":true,"kty":"RSA","n":"udjjhLDF-MJRIcnt4c8sPZcvbccEtVxvVVvvufO7CZFQOchFA5RRq55ai7N3JhLst8gU4Ghfs3k7vNhui-wADVICIENWSdE_jPbPap2cHqU2chHnXPFMBln066OVh2umbGq05m0Ww9V-FGu34pYXduNrCfqIId0O4gdjRniHwZ3D-Qm9Eeokal8JOFNC4VFnk0JjQBb9Mf1S6fKibUj-sb6xwVlXAciM2013aIwJrMWeVt2nPvoKA99-4mFCG9pKRPlFhzyQaFgjabp4fMM0tzu81ISeyA0n86VA86Mq547r3f7kWjHRwjQyHLiYG_l1rMQVdIoe7tNjMCP-pvHPkw","e":"AQAB","alg":"RS512"}';
const publicKey = await importJwk(publicJwk);

providerKeyStore.set("04ecbeaf-c0e7-433a-a31a-b34828d56ed9", publicKey);

const connector = new MqttConnector();
provider.attachToBus(connector);

provider.registerThing(new DemoThing(Date()));
