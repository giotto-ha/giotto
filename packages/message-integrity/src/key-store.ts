import { ThingId } from "@giotto/core/things.js";
import { webcrypto } from "node:crypto";

/**
 * A KeyStore is a place where the public keys of Things can be kept and retrieved
 * 
 * It's intentionally asynchronous to allow for implementations that store keys in a database (or similar)
 */
export interface KeyStore<ID=ThingId> {
    get(thingId: ID): Promise<webcrypto.CryptoKey | undefined>;
    set(thingId: ID, key: webcrypto.CryptoKey): Promise<void>;
    delete(thingId: ID): Promise<void>;
    clear(): Promise<void>;
    has(thingId: ID): Promise<boolean>;
}

export interface ReadonlyKeyStore<ID=ThingId> {
    get(thingId: ID): Promise<webcrypto.CryptoKey | undefined>;
    has(thingId: ID): Promise<boolean>;
}