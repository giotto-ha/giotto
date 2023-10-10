import { BusMessage } from "@giotto/bus-connector/BusConnector.js";
import { subtle, webcrypto } from "node:crypto";

export const signMessage = async <M extends BusMessage>(
  message: Omit<M, 'signature'>,
  privateKey: webcrypto.CryptoKey
): Promise<M> => {
  delete message['signature']
  
  const messageBuffer = new TextEncoder().encode(
    JSON.stringify(message)
  );
  const sig = await subtle.sign("RSASSA-PKCS1-v1_5", privateKey, messageBuffer);
  return {
    ...message,
    signature: btoa(String.fromCharCode(...new Uint8Array(sig))),
  } as M;
};
