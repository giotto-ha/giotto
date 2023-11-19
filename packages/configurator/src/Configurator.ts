import "reflect-metadata";

import { BusConnector } from "@giotto/bus-connector";
import type { ThingId } from "@giotto/core/things.js";
import { type KeySet } from "@giotto/message-integrity/get-keys.js";
import { KeyStore } from "@giotto/message-integrity/key-store.js";
import { signMessage } from "@giotto/message-integrity/sign.js";
import { validateMessage } from "@giotto/message-integrity/validate.js";
import debug from "debug";
import { webcrypto } from "node:crypto";
import { ConfigReport } from "./messages/ConfigReport.js";
import { ConfigRequest, isConfigRequest } from "./messages/ConfigRequest.js";
import { UUID } from "./types.js";

type ConfigEntry<C extends object> = C & { publicKey: webcrypto.CryptoKey };

export class Configurator {
  private quiescedThingIds: ThingId[] = [];
  private config: Map<ThingId, ConfigEntry<object>> = new Map();
  private debug: ReturnType<typeof debug>;

  constructor(
    private uuid: UUID,
    private connector: BusConnector,
    private keys: KeySet,
    private keyStore: KeyStore
  ) {
    this.debug = debug(`giotto:configurator:${this.uuid}`);
    console.log(this.keyStore);
  }

  async start() {
    this.debug(`Configurator started with UUID ${this.uuid}`);
    this.config.set(2, { publicKey: this.keys.publicKey });
    await this.connector.listenTo("config", (message) => {
      if (isConfigRequest(message)) {
        this.handleConfigRequest(message);
      }
    });
    this.debug(`Configurator[${this.uuid}] listening to config topic`);
  }

  async handleConfigRequest(configRequest: ConfigRequest) {
    this.debug("Handling ConfigRequest", configRequest);
    if (this.quiescedThingIds.includes(configRequest.thingId)) {
      return;
    }
    const config = this.config.get(configRequest.thingId);
    if (config === undefined) {
      this.debug(
        `Configurator[${this.uuid}] has no config for thing ${configRequest.thingId}`
      );
      return;
    }
    const validRequest = validateMessage(configRequest, config.publicKey);
    if (validRequest === undefined) {
      this.debug(
        `Configurator[${this.uuid}] received invalid ConfigRequest from thing ${configRequest.thingId}`
      );
      return;
    }

    const configReport: ConfigReport = await signMessage(
      {
        type: "ConfigReport",
        thingId: configRequest.thingId,
        source: this.uuid,
        config,
      },
      this.keys.privateKey
    );

    this.connector.sendMessage("config", configReport);
  }
}
