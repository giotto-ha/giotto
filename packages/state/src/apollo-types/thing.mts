import { Configuration } from "./configuration.mjs";
import { ThingState } from "./thing-state.mjs";


export class Thing {
  constructor(public thingId: number, public eState: ThingState, public sState: ThingState, public parent: Thing, public config: Configuration) {
        
    }
}
