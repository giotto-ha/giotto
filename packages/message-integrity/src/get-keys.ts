import { stat, readFile } from "node:fs/promises";
import { subtle, webcrypto } from "node:crypto";
import debug from "debug";

const PUBLIC_KEY_OPS = ["verify"] as const;
const PRIVATE_KEY_OPS = ["sign"] as const;

export type KeySet = {
  privateKey: webcrypto.CryptoKey;
  publicKey: webcrypto.CryptoKey;
}

const DEBUG=debug("message-integrity:get-keys");

export const getKeys = async (): Promise<KeySet> => {
  const privateKeyFile = process.env.PRIVATE_KEY_FILE ?? `./private.key`;
  let privateJwk: webcrypto.JsonWebKey | undefined = undefined;
  try {
    const privateKeyFileInfo = await stat(privateKeyFile);
    if (!privateKeyFileInfo.isFile()) {
      throw new Error(`Private key file ${privateKeyFile} is not a file.`);
    }
    const fileMode = (privateKeyFileInfo.mode & 0o777)
    if (fileMode !== 0o400) {
      throw new Error(`Private key file ${privateKeyFile} is not protected (${fileMode.toString(8)}).`);
    }

    privateJwk = JSON.parse(await readFile(
      privateKeyFile,
      "utf-8"
    )) as unknown as webcrypto.JsonWebKey;
  } catch (e) {
    console.log(e)
    if (e instanceof SyntaxError) {
      DEBUG(
        `Private key file ${privateKeyFile} is not a valid JSON file.`
      );
    }
    DEBUG(`Private key file ${privateKeyFile} is not valid.`);
  }
  if (privateJwk === undefined) {
    const keyPair = await subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-512" },
      },
      true,
      [...PUBLIC_KEY_OPS, ...PRIVATE_KEY_OPS]
    );
    privateJwk = await subtle.exportKey("jwk", keyPair.privateKey);
  }

  const publicJwk = { ...privateJwk };
  delete publicJwk.d;
  delete publicJwk.dp;
  delete publicJwk.dq;
  delete publicJwk.q;
  delete publicJwk.qi;
  publicJwk.key_ops = [...PUBLIC_KEY_OPS];
  const publicKey = await subtle.importKey(
    "jwk",
    publicJwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
    true,
    PUBLIC_KEY_OPS
  );
  const privateKey = await subtle.importKey(
    "jwk",
    privateJwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" },
    true,
    PRIVATE_KEY_OPS
  );

  return { privateKey, publicKey };
};
