import { BusMessage, Unsigned } from "@giotto/bus-connector/BusConnector.js";
import { createHmac, subtle, webcrypto } from "node:crypto";

export const signMessage = async <M extends BusMessage>(
  message: Unsigned<M>,
  privateKey: webcrypto.CryptoKey
): Promise<M> => {

  const encoder = new TextEncoder();
  const items = (Object.keys(message) as (keyof typeof message)[]).filter(key => key !== 'signature' && typeof key !== 'symbol').flatMap((key) => {

    return `${String(key)}:${JSON.stringify(message[key])}`;

  }).join('\n');

  const sig = await subtle.digest('sha-256', encoder.encode(items));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return {
    ...(message as M),
    signature,
  };
};
