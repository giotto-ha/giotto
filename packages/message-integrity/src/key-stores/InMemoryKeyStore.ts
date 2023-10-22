import { ThingId } from "@giotto/core/things.js";
import { webcrypto } from "node:crypto";
import { KeyStore } from "../key-store.js";


/**
 * KeyStore is a simple key-value store for storing public keys for Things
 */
export class InMemoryKeyStore implements KeyStore {
    private keys: Map<ThingId, webcrypto.CryptoKey> = new Map();

    /**
     * Get the public key for a Thing
     * @param thingId The Thing ID
     * @returns The public key for the Thing
     */
    public get(thingId: ThingId): Promise<webcrypto.CryptoKey | undefined> {
        return Promise.resolve(this.keys.get(thingId));
    }

    /**
     * Set the public key for a Thing
     * @param thingId The Thing ID
     * @param key The public key for the Thing
     */
    public set(thingId: ThingId, key: webcrypto.CryptoKey): Promise<void> {
        this.keys.set(thingId, key);
        return Promise.resolve();
    }

    /**
     * Delete the public key for a Thing
     * @param thingId The Thing ID
     */
    public delete(thingId: ThingId): Promise<void> {
        this.keys.delete(thingId);
        return Promise.resolve();
    }

    /**
     * Clear the key store
     */
    public clear(): Promise<void> {
        this.keys.clear();
        return Promise.resolve();
    }

    /**
     * Check if the key store has a public key for a Thing
     * @param thingId The Thing ID
     * @returns True if the key store has a public key for the Thing
     */
    public has(thingId: ThingId): Promise<boolean> {
        return Promise.resolve(this.keys.has(thingId));
    }
}