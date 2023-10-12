# Registration

The Registration process allows Things to be assigned a `thingId`. This then allows them to request configuration information and interacting with the GIoTTo ecosystem.

The process is relatively simple:

 - Thing puts its UUID and public key onto the GIoTTo bus, on the `register` topic.
 - The `RegistryService` either finds a previously assigned `thingId` or assigns a new one.
   - If the UUID is already assigned to a `thingId`, then the public key must match the one in the Registry, otherwise an Error is raised.
 - The `RegistryService` puts the assigned `thingId`, UUID, the thing's public key and the registry's public key onto the GIoTTo bus.
 - The Thing now uses its `thingId` for further interactions.

## Registry Operations
There are a small number of operations that can be performed on the Registry:

 - `RegisterThing`
 - `DeregisterThing`
 - `ReplaceThing`
 - `UpdateKey`

### RegisterThing
This operation register's a Thing with the Registry. It's an idempotent operation, which makes it easier for Thing initialization.

#### RegisterThingRequest
```typescript
{
    type: "RegisterThingRequest";
    uuid: string; // Any UUID is acceptable
    publicKey: string; // A public key in JsonWebKey format, generated with the RSASSA-PKCS1-v1_5 algorithm
}
```

#### RegisterThingResponse
```typescript
{
    type: "RegisterThingResponse",
    uuid: string,           // The UUID provided in the RegisterThingRequest
    thingId: number,        // The assigned thing ID
    publicKey: string       // The publicKey provided in the RegisterThingRequest
    registryPublicKey: string; // The Registry's public key
}
```

### DeregisterThing
This operation removes a Thing from the Registry.

See [#19](https://github.com/giotto-ha/giotto/issues/19)

### ReplaceThing
This operation replaces a Thing with UUID-A with a Thing with UUID-B. The new thing will retain the `thingId`. This is useful for replacing compatible Things without having to reconfigure everything.

See [#20](https://github.com/giotto-ha/giotto/issues/20)

### UpdateKey
This operation updates the public key associated with the Thing.

See [#21](https://github.com/giotto-ha/giotto/issues/21)