import { BusMessage } from "@giotto/bus-connector";
import { ThingId } from "@giotto/core/things.js";


export interface ConfigRequest extends BusMessage<"ConfigRequest"> {
    thingId: ThingId
}

export const isConfigRequest = (message: BusMessage<any>): message is ConfigRequest => {
    return message.type === "ConfigRequest";
}