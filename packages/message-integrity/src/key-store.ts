import { ThingId } from "@giotto/core/things.js";
import { webcrypto } from "node:crypto";

/**
 * A KeyStore is a place where the public keys of Things can be kept and retrieved
 * 
 * It's intentionally asynchronous to allow for implementations that store keys in a database (or similar)
 */
export interface KeyStore {
    get(thingId: ThingId): Promise<webcrypto.CryptoKey | undefined>;
    set(thingId: ThingId, key: webcrypto.CryptoKey): Promise<void>;
    delete(thingId: ThingId): Promise<void>;
    clear(): Promise<void>;
    has(thingId: ThingId): Promise<boolean>;
}
