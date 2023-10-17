import 'reflect-metadata';

import { Registry, RegistryEntry } from "./Registry.js";
import type {
  BusConnector,
  BusMessage,
} from "@giotto/bus-connector/BusConnector.js";
import { validateMessage } from "@giotto/message-integrity/validate.js";
import { signMessage } from "@giotto/message-integrity/sign.js";
import { getKeys } from "@giotto/message-integrity/get-keys.js";
import { subtle } from "node:crypto";
import debug from "debug";
import { Inject, Parameter, Service } from "diosaur";

interface RegisterThingRequest extends BusMessage {
  type: "RegisterThingRequest";
  uuid: string;
  publicKey: string;
}

interface RegisterThingResponse extends BusMessage, RegistryEntry {
  type: "RegisterThingResponse"
  registryPublicKey: string;
}

const isRegistrationRequest = (
  message: BusMessage
): message is RegisterThingRequest => {
  return (
    message.type === "RegisterThing" &&
    ["uuid", "publicKey"].every((key) => key in message)
  );
};

const DEBUG = debug("registry:service")

@Service()
export class RegistryService {
  private privateKey!: CryptoKey;
  private publicKey!: CryptoKey;
  private started: boolean = false;
  
  constructor(
    @Parameter("RegistryConnector") private busConnector: BusConnector,
    @Inject() private registry: Registry
  ) { }

  async start() {
    if (this.started) {
      return;
    }
    DEBUG("Starting registry service");
    const { privateKey, publicKey } = await getKeys();
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.busConnector.listenTo("registry", async (message: BusMessage) => {
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
    this.busConnector.stopListeningTo("registry");
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
          { type: "Registration", ...entry, registryPublicKey: this.publicKey },
          this.privateKey
        );
        this.busConnector.sendMessage("registry", responseMessage);
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
