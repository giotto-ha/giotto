import type { BusMessage } from "@giotto/bus-connector/BusConnector.js";
import type { RegistryEntry } from "./Registry.js";
import { UUID } from "@giotto/core/things.js";

export interface RegisterThingRequest extends BusMessage<"RegisterThingRequest"> {
    uuid: string;
    publicKey: string;
  }

  
  export interface RegisterThingResponse extends BusMessage<"RegisterThingResponse">, RegistryEntry {
    registryPublicKey: string;
    source: UUID
  }
  
  export const isRegistrationRequest = (
    message: BusMessage
  ): message is RegisterThingRequest => {
    return (
      message.type === "RegisterThingRequest" &&
      ["uuid", "publicKey"].every((key) => key in message)
    );
  };
  
  export const isRegisterThingResponse = (
    message: BusMessage
  ): message is RegisterThingResponse => {
    return (
      message.type === "RegisterThingResponse" &&
      ["uuid", "publicKey", "registryPublicKey"].every((key) => key in message)
    );
  }