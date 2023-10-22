import { describe, it, expect } from "@jest/globals";
import { getKeys } from "./get-keys.js";
describe('getKeys', () => {
    it('should return a keyset', async () => {
        const keySet = await getKeys();
        expect(keySet).toHaveProperty('privateKey');
        expect(keySet).toHaveProperty('publicKey');
    });
});