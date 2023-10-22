import { BusMessage, Unsigned } from "@giotto/bus-connector";
import { getKeys } from "./get-keys.js";
import { subtle } from "node:crypto";
import { signMessage } from "./sign.js";

export const selfSign = async <M extends BusMessage>(
  message: Unsigned<M>& { publicKey?: string }
): Promise<M> => {
    const {publicKey, privateKey}= await getKeys();
    const publicJwk = await subtle.exportKey("jwk", publicKey);
    message.publicKey = JSON.stringify(publicJwk);

    const signedMessage = await signMessage(message, privateKey);
    return signedMessage;
};
