export type ThingId = number

export type UUID = string;

export interface Thing<C={}> {
    id: ThingId | undefined;
    uuid: UUID;
    configuration: C | {};
}