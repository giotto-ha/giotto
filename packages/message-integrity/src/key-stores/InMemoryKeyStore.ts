import { webcrypto } from "node:crypto";
import { KeyStore } from "../key-store.js";
import { ThingId } from "@giotto/core/things.js";


/**
 * KeyStore is a simple key-value store for storing public keys for Things
 */
export class InMemoryKeyStore<ID = ThingId> implements KeyStore<ID> {
    private keys: Map<ID, webcrypto.CryptoKey> = new Map();

    /**
     * Get the public key for a Thing or Provider
     * @param id The Thing or Provider ID
     * @returns The public key for the Thing or Provider
     */
    public get(id: ID): Promise<webcrypto.CryptoKey | undefined> {
        return Promise.resolve(this.keys.get(id));
    }

    /**
     * Set the public key for a Thing or Provider
     * @param id The Thing or Provider ID
     * @param key The public key for the Thing or Provider
     */
    public set(id: ID, key: webcrypto.CryptoKey): Promise<void> {
        this.keys.set(id, key);
        return Promise.resolve();
    }

    /**
     * Delete the public key for a Thing or Provider
     * @param id The Thing or Provider ID
     */
    public delete(id: ID): Promise<void> {
        this.keys.delete(id);
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
     * Check if the key store has a public key for a Thing or Provider
     * @param id The Thing or Provider ID
     * @returns True if the key store has a public key for the Thing
     */
    public has(id: ID): Promise<boolean> {
        return Promise.resolve(this.keys.has(id));
    }
}