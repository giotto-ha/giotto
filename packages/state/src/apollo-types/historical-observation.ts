import { Measure } from "./measure.js";

export class HistoricalObservation {
  timestamp: string = "";
  label: string = "";
  measure: Measure | null = null;
}
