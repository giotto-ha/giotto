import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import { GiottoStateContext } from "./apollo-context.mjs";
import {getThings} from "./resolvers/things.mjs";
import { DataSource } from 'apollo-datasource'

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const gqlSchema = readFileSync(`${__dirname}/schema.graphql`, "utf8");

const resolvers = {
    Query: {
        things: getThings
    }
}

export class GqlServerBuilder {
    private context: GiottoStateContext = {};
    private schema: string = "";
    private resolvers: any;

    constructor() {
        
    }

    setSchema(schema: string) {
        this.schema = schema;
        return this
    }

    setResolvers(resolvers: any) {
        this.resolvers = resolvers;
        return this;
    }

    addDataSource<T>(name: string, dataSource: DataSource<T>) {



    async build() {
        const server = new ApolloServer<GiottoStateContext>({ typeDefs: this.schema, resolvers: this.resolvers });
        const { url } = await startStandaloneServer(server, {
            context: async (): Promise<GiottoStateContext> => {
                return this.context;
            }
        });
        return url;
    }
}

const server = new ApolloServer<GiottoStateContext>({ typeDefs: gqlSchema, resolvers });

const { url } = await startStandaloneServer(server, {
    context: async (): Promise<GiottoStateContext> => {
        return {
            
        };
    }
});

console.log(`Listening at ${url}`);
