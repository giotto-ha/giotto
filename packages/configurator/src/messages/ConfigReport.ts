import { BusMessage } from "@giotto/bus-connector";
import { ThingId } from "@giotto/core/things.js";
import { UUID } from "../types.js";

export interface ConfigReport<C extends {} = {}> extends BusMessage<"ConfigReport"> {
    thingId: ThingId,
    source: UUID,
    config: C
}

export const isConfigReport = (message: BusMessage<string>): message is ConfigReport => {
    return message.type === "ConfigReport";
}
