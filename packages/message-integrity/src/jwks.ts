import { subtle } from "node:crypto";

export const exportJwk = async (key: CryptoKey): Promise<string> => JSON.stringify(await subtle.exportKey("jwk", key));

export const importJwk = async (jwk:string): Promise<CryptoKey> => {
    const key = await subtle.importKey("jwk", JSON.parse(jwk) as JsonWebKey, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" }, true, ["verify"]);
    return key;
}