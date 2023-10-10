/// <reference lib="dom" />
import { BusMessage } from "@giotto/bus-connector/BusConnector.js";
import { subtle, webcrypto } from "node:crypto";

export const validateMessage = async <M extends BusMessage>(
  message: M,
  publicKey: webcrypto.CryptoKey
): Promise<boolean> => {
  try {
    const { signature, ...messageWithoutSignature } = message;
    const signatureBuffer = new Uint8Array(
      atob(signature)
        .split("")
        .map((c) => c.charCodeAt(0))
    );
    const messageBuffer = new TextEncoder().encode(
      JSON.stringify(messageWithoutSignature)
    );
    return await subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signatureBuffer,
      messageBuffer
    );
  } catch (e) {
    if (e instanceof DOMException) {
      if (["InvalidAccessError","InvalidCharacterError"].includes(e.name)) {
        return false;
      }
      console.error('Unexpected DOMException: ', e.name)
    }
    console.error(`Unexpected error while validating message: ${e}`)

    throw e;
  }
};
