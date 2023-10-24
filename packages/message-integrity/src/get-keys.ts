import { stat, readFile } from "node:fs/promises";
import { subtle, webcrypto } from "node:crypto";
import debug from "debug";
import { importKey } from "./import-key.js";
import { createPrivateKey, createPublicKey } from "./create-key.js";



export type KeySet = {
  privateKey: webcrypto.CryptoKey;
  publicKey: webcrypto.CryptoKey;
}

const DEBUG = debug("message-integrity:get-keys");

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
    const keyPair = await createPrivateKey();
    privateJwk = await subtle.exportKey("jwk", keyPair.privateKey);
  }

  const publicKey = await createPublicKey(privateJwk);
  const privateKey = await importKey({ privateJwk });

  return { privateKey, publicKey };
};
