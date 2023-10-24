import { InMemoryKeyStore } from "@giotto/message-integrity/key-stores/InMemoryKeyStore.js";
import { BaseProvider } from "./BaseProvider.js";
import { BaseThing } from "./BaseThing.js";
import { getKeys } from "@giotto/message-integrity/get-keys.js";
import { UUID } from "./things.js";
import { MqttConnector } from "@giotto/bus-connector/implementations/MqttConnector.js";
import { importJwk } from "@giotto/message-integrity/jwks.js";

class DemoProvider extends BaseProvider { }
class DemoThing extends BaseThing<{
    test: number
}> {
    configuration = {}
}

const thingKeyStore = new InMemoryKeyStore()
const providerKeyStore = new InMemoryKeyStore<UUID>()
const keySet = await getKeys();
const provider = new DemoProvider(thingKeyStore, providerKeyStore, keySet);

const publicJwk = '{"key_ops":["verify"],"ext":true,"kty":"RSA","n":"zzYl72HLhjSW3WHsqD40EgIgnMoOczemRxcbEAUivcgxJebfa-fpuQnwR-xdJobtlOd9Q1Mrn1wwd8wLuuQB_C0JqZ2oJfpiCsm5CWb9b2PoAE_xEsXaZZXpWMmscT_3YWgOpZZYnjpy3YYwzrhlQFwD54wEZYFopMW0OLmRBhLTxJyEIpN0fmd6FK5vlXL3-L6yOwOmn8og1rsDgJ8Nxim-ylAdIeyZY85914uKhFzOF6AMgBVyO9DgT8YhoUfI8qiBlZd3u0HsgZp9C1GoFQpluJFUOmOyPf34loSNSExMUVM4cN_vRELAGkF_WVjiF_L22y6otjwm8mAhncl28w","e":"AQAB","alg":"RS512"}';
const publicKey = await importJwk(publicJwk);

providerKeyStore.set('04ecbeaf-c0e7-433a-a31a-b34828d56ed9', publicKey);

const connector = new MqttConnector();
provider.attachToBus(connector);

provider.registerThing(new DemoThing(Date()))