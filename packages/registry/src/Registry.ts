import debug from "debug";
import type {  Collection } from "mongodb";

export type RegistryEntry = {
  uuid: string,
  thingId: number,
  publicKey: string
}

const DEBUG = debug("giotto:registry")


export class Registry {
  constructor( private registry: Collection<RegistryEntry>) {}
  
  async getNextThingId() {
    const latestThing = await this.registry.find().sort({ thingId: -1 }).limit(1).next();
    if (!latestThing) {
      return 1;
    }
    return latestThing.thingId + 1;
  }

  async getThingByUuid(uuid: string) {
    return this.registry.findOne({ uuid });
  }

  async registerThing(uuid: string, publicKey: string) {
    DEBUG(`Registering thing ${uuid}`);
    const registryEntry = await this.getThingByUuid(uuid);
    if (registryEntry) {
      DEBUG(`Thing ${uuid} already registered as ${registryEntry.thingId}`)
      if (publicKey !== '' && registryEntry.publicKey !== publicKey) {
        throw new Error("Public key mismatch");
      }
      return registryEntry;
    }
    
    const thingId = await this.getNextThingId();
    const newEntry = { uuid, thingId, publicKey };
    await this.registry.insertOne(newEntry);

    DEBUG(`Registered thing ${uuid} as ${thingId}`)

    return newEntry;
  }
}


