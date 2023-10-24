import { subtle, webcrypto } from "node:crypto";
import { PRIVATE_KEY_OPS, PUBLIC_KEY_OPS } from "./key-ops.js";



const toJwk = (key: string | webcrypto.JsonWebKey) => {
    if (typeof key === "string") {
        return JSON.parse(key) as webcrypto.JsonWebKey;
    } else {
        return key;
    }
}

export const importKey = async (key: { publicJwk: string| webcrypto.JsonWebKey} | { privateJwk: string | webcrypto.JsonWebKey}) => {
    if ('publicJwk' in key) {
        return subtle.importKey(
            "jwk",
            toJwk(key.publicJwk),
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
            true,
            PUBLIC_KEY_OPS
        );
    } else {
        return subtle.importKey(
            "jwk",
            toJwk(key.privateJwk),
            { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
            true,
            PRIVATE_KEY_OPS
        );
    }

}