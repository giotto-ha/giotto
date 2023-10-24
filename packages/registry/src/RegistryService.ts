import 'reflect-metadata';

import { Registry } from "./Registry.js";
import type {
  BusConnector,
  BusMessage,
} from "@giotto/bus-connector/BusConnector.js";
import { validateMessage } from "@giotto/message-integrity/validate.js";
import { signMessage } from "@giotto/message-integrity/sign.js";
import { getKeys } from "@giotto/message-integrity/get-keys.js";
import { subtle } from "node:crypto";
import debug from "debug";
import { RegisterThingResponse, isRegistrationRequest } from './messages.js';
import { REGISTRY_TOPIC } from './topics.js';
import { UUID } from '@giotto/core/things.js';
import { exportJwk } from '@giotto/message-integrity/jwks.js';


const DEBUG = debug("giotto:registry:service")


export class RegistryService {
  private privateKey!: CryptoKey;
  private publicKey!: CryptoKey;
  private started: boolean = false;

  constructor(
    private busConnector: BusConnector,
    private registry: Registry,
    private uuid: UUID
  ) { }

  async start() {
    if (this.started) {
      return;
    }
    DEBUG(`Starting registry service with UUID ${this.uuid}`);
    const { privateKey, publicKey } = await getKeys();
    DEBUG(`Public key is ${await exportJwk(publicKey)}`)
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.busConnector.listenTo(REGISTRY_TOPIC, async (message: BusMessage) => {
      try {
        await this.handleMessage(message);
      } catch (e) {
        console.error("Error handling message", e);
      }
    });
    DEBUG("Registry service started");
    this.started = true;
  }

  shutdown() {
    DEBUG("Shutting down registry service");
    this.busConnector.stopListeningTo(REGISTRY_TOPIC);
    this.started = false;
    DEBUG("Registry service shut down");
  }

  private async handleMessage(message: BusMessage) {
    DEBUG("Received message", message);

    if (isRegistrationRequest(message)) {
      try {
        const pubKey = await subtle.importKey('jwk', JSON.parse(message.publicKey) as JsonWebKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" }, true, ["verify"]);
        const isValid = await validateMessage(message, pubKey);
        if (!isValid) {
          DEBUG("Improperly signed message received.", message);
          return;
        }
        const entry = await this.registry.registerThing(
          message.uuid,
          message.publicKey
        );
        const responseMessage = await signMessage<RegisterThingResponse>(
          { type: "RegisterThingResponse", ...entry, source: this.uuid, registryPublicKey: await exportJwk(this.publicKey) },
          this.privateKey
        );
        this.busConnector.sendMessage(REGISTRY_TOPIC, responseMessage);
      } catch (e) {
        if (e instanceof DOMException) {
          console.error("Hit a problem validating message", e.name, e.message);
        } else {
          throw e;
        }
      }
    }
  }
}
