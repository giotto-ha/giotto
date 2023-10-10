import { HistoricalObservation } from "./historical-observation.js";
import { Observation } from "./observation.js";

export class ThingState {
  lastObservation: string
    observations: Observation[]
    log: HistoricalObservation[]

    constructor() {
        this.lastObservation = "";
        this.observations = [];
        this.log = [];
    } 
}
