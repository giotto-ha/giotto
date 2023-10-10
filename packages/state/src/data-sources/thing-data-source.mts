
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'

interface ConfigurationDocument {
    _id: ObjectId
    configString: string,
}

interface ThingDocument {
    _id: ObjectId
    thingId: number,
    parentThingId: number,
    config: ConfigurationDocument
  }


export  class Things extends MongoDataSource<ThingDocument> {
    async getThing(thingId: number) {
      const things = await this.findByFields({thingId});
      if(things.length === 0) {
        return null;
      }
      if(things.length > 1) {
        throw new Error("Multiple things with the same thingId");
      }
        
      return things[0] as ThingDocument;
    }
  }