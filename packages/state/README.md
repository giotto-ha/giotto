# GIoTTo State

In order to facilitate a wide variety of devices, GIoTTo maintains a centralized repository of state that all 
components can access via the GIoTTo bus.

However, in order for the state of a Thing to be tracked, it first needs to be registered.

## High Level process

Registration is relatively straightforward. All communication is via the bus.

 1. A Provider requests the registration of a Thing
 2. A message is returned  with a ThingId (see below)
 3. Initial State update is sent by the Provider for the Thing in question

Since every Provider is also a Thing, a new Provider will need to register itself first, before registering Things it's responsible for.

### ThingId

A ThingId is how each thing in a GIoTTo network is represented.

It is a 32-bit number, with higher bits carrying basic information about the
thing's capabilities. The top two bytes are reserved for future capabilities. The bottom two bytes are sufficient for over 65,000 Things to exist on a GIoTTo network.

| Bit   | Purpose                              |
| ----: | :----------------------------------- |
|    31 | Thing reports EState                 |
|    30 | Thing reports SState                 |
|    29 | Thing modifies environment           |
|    28 | Thing is a Provider                  |
| 26-27 | _Reserved_                           |
|  0-15 | ID                                   |

So, a thermometer device might have a ThingId of `0x80000001`, whereas a switch might have a ThingId of `0x60000001`

It is the whole ThingId itself which is unique, not just the ID bits.

## Messages

There are three messages involved in the registration process:

 - `RegisterThing`
 - `AcceptRegistration`
 - `RejectRegistration`
 - `ReportState`

### RegisterThing

This message is sent by a Provider for a Thing to register it with the system.

```
{
    type: "RegisterThing",
    thingId: number,
    uid: string,
    parentId?: number
}
```

`parentId` is the ThingId of the registering Provider. If `parentId` is not provided, then bit 28 of `thingId` must be set.

The `uid` can be any string; this will be echoed back in the response messages so that the Provider knows which of its Things the messages refer to. It __really__ needs to be unique, so hardware MAC addresses or a UUID are recommended.

For new Things, `thingId` will be `0xCCCC0000` where `CCCC` are capability bits.
For pre-existing Things, the stored `thingId` can be sent and, if it exists and is associated with the provided `parentId`, then it will be accepted. 
If it is not currently in use, it will also be accepted.
Otherwise, a new ThingID will be provided.

This allows for the automatic recovery of state in the case of a loss of data event.


### AcceptRegistration

Assuming everything is in order, a registration request is accepted with the following message:

```typescript
{
    type: "AcceptRegistration",
    thingId: number,
    uid: string,
    parentId: number
}
```

For a new Provider, `parentId` and `thingId` will be identical.

Registering Providers should store the `thingId` for each thing for all future communication

### RejectRegistration

There are a number of reasons why a registration request may be rejected:

 - No more Thing IDs are available
   (highly unlikely but architecturally possible)
 - Reserved bits are set
   (since these carry meaning, it is safer to reject such requests and allow the Provider to try again without support for unknown capabilities) 
 - Others that may be discovered

The message will look like this:

```typescript
{   
    type: "RejectRegistration",
    uid: string,
    reason: string
}
```

Recovery from a rejected registration is to simply try again with new values in the `RegisterThing` message.