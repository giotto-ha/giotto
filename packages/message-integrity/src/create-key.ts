import { subtle, webcrypto } from "node:crypto";
import { PRIVATE_KEY_OPS, PUBLIC_KEY_OPS } from "./key-ops.js";
import { importKey } from "./import-key.js";


export const createPrivateKey = () => {
    return subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: "SHA-512" },
        },
        true,
        [...PUBLIC_KEY_OPS, ...PRIVATE_KEY_OPS]
    );
}

export const createPublicKey = async (privateJwk: webcrypto.JsonWebKey) => {
    const publicJwk = { ...privateJwk };
    delete publicJwk.d;
    delete publicJwk.dp;
    delete publicJwk.dq;
    delete publicJwk.q;
    delete publicJwk.qi;
    publicJwk.key_ops = [...PUBLIC_KEY_OPS];
    return await importKey({ publicJwk })
};