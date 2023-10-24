import { ThingId, UUID } from "@giotto/core/things.js";
import { Thing } from "./things.js";

export abstract class BaseThing<C={}> implements Thing<C> {
    id: ThingId | undefined;
    configuration: C | {} = {};
    constructor(readonly uuid: UUID) {}    
}