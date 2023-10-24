import type { BusConnector, BusMessage, Unsigned } from "@giotto/bus-connector/BusConnector.js";
import type { KeySet } from "@giotto/message-integrity/get-keys.js";
import type { KeyStore, ReadonlyKeyStore } from "@giotto/message-integrity/key-store.js";
import { isRegisterThingResponse, type RegisterThingRequest } from "@giotto/registry/messages.js";
import { Thing, ThingId, UUID } from "./things.js";
import { signMessage } from "@giotto/message-integrity/sign.js";
import { REGISTRY_TOPIC } from "@giotto/registry/topics.js"
import { CONFIGURATION_TOPIC } from "@giotto/configurator/topics.js"
import type { ConfigRequest } from "@giotto/configurator/messages/ConfigRequest.js";
import { isConfigReport } from "@giotto/configurator/messages/ConfigReport.js";
import { validateMessage } from "@giotto/message-integrity/validate.js";
import { exportJwk, importJwk } from "@giotto/message-integrity/jwks.js";
import debug from "debug";


const DEBUG = debug('giotto:base-provider')

export abstract class BaseProvider {
    private connectors: BusConnector[] = [];
    private things: Thing[] = [];

    constructor(private thingKeyStore: KeyStore<ThingId>, private providerKeyStore: ReadonlyKeyStore<UUID>, private keySet: KeySet) { }

    attachToBus(connector: BusConnector) {
        DEBUG('Attaching to bus')
        this.connectors.push(connector);
        connector.listenTo(REGISTRY_TOPIC, async (message: BusMessage) => {
            DEBUG(`Received message on ${REGISTRY_TOPIC}`, message);
            if (isRegisterThingResponse(message)) {
                DEBUG(`Received registration response for thing ${message.uuid}`);
                const registryKey = await this.providerKeyStore.get(message.source);
                if (!registryKey) {
                    DEBUG(`No registry key found for ${message.source}`);
                    return;
                }
                const isValid = await validateMessage(message, registryKey);
                if (!isValid) {
                    DEBUG(`Registration response for thing ${message.uuid} is not valid`);
                    return;
                }

                const thing = this.things.find(thing => thing.uuid === message.uuid);
                const publicKey = await importJwk(message.publicKey);
                if (thing) {
                    thing.id = message.thingId;
                    DEBUG(`Thing ID set as ${thing.id}`);
                    this.thingKeyStore.set(thing.id!, publicKey);
                }
            }
        })
        connector.listenTo(CONFIGURATION_TOPIC, async (message: BusMessage) => {
            DEBUG(`Received message on ${CONFIGURATION_TOPIC}`, message);
            if (isConfigReport(message)) {
                const configuratorKey = await this.providerKeyStore.get(message.source);
                if (!configuratorKey) {
                    return;
                }
                const isValid = await validateMessage(message, configuratorKey);
                if (!isValid) {
                    return;
                }
                const thing = this.things.find(thing => thing.id === message.thingId);
                if (!thing) {
                    return;
                }
                thing.configuration = message.config;
            }
        });
    }

    async registerThing(thing: Thing) {
        DEBUG(`Registering thing ${thing.uuid}`);
        this.things.push(thing);
        const registerMessage: RegisterThingRequest = await signMessage({
            type: "RegisterThingRequest",
            uuid: thing.uuid,
            publicKey: await exportJwk(this.keySet.publicKey)
        } satisfies Unsigned<RegisterThingRequest>, this.keySet.privateKey)
        this.connectors.forEach(connector => connector.sendMessage(REGISTRY_TOPIC, registerMessage));
    }

    async getConfiguration(thing: Thing) {
        DEBUG(`Requesting configuration for thing ${thing.uuid}`);
        const configurationRequest: ConfigRequest = await signMessage({
            type: "ConfigRequest",
            thingId: thing.id!,
        } satisfies Unsigned<ConfigRequest>, this.keySet.privateKey)
        this.connectors.forEach(connector => connector.sendMessage(CONFIGURATION_TOPIC, configurationRequest));
    }
}