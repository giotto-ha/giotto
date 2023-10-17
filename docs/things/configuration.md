# Thing Configuration

A Thing may handle its own configuration, via any proprietary means it likes. However, GIoTTo provides a configuration process that can help simplify Thing management.

## Configuration sources

A configuration source is a component that manages configuration information for one or more Things.

Each Configuration Source has a UUID; this is used to co-ordinate configuration when multiple sources are on the GIoTTo bus.

## Configuration process

The configuration process, from boot up, is pretty straightforward:

1. Thing powers on
2. Thing registers and gets its `thingId`
3. Thing puts a `ConfigRequest` onto the GIoTTo bus
4. Thing picks up a `ConfigReport` from the GIoTTo bus

These four steps apply for brand new Things, as well as returning Things.

Whenever a `ConfigReport` is picked up from the bus, the reference Thing should act on it as appropriate.

Modifying a Thing's configuration can be done via a `ConfigPatch` or a `ConfigUpdate`.

## Configuration Messages

These are the relevant messages for managing Thing Configuration.

### ConfigRequest

This message comes from a Thing (or Provider) and simply requests that the configuration associated with `thingId` be put onto the bus.

```json
{
    "type": "ConfigRequest",
    "thingId": ThingId
}
```

### ConfigReport

This message contains the configuration for the Thing identified by `thingId`. The `config` object can be any serializable object and should be considered opaque to all but the target Thing.

```json
{
    "type": "ConfigReport",
    "source": UUID,
    "thingId": ThingId,
    "config": {
        // Configuration object specific to the relevant Thing
    }
}
```

### ConfigPatch

This message contains updates for whichever system is holding the Thing's configuration information.

As a Patch, it only needs to contain the keys and values that are to be updated. Any unreferences keys are left unchanged

```json
{
    "type": "ConfigPatch",
    "source": UUID,
    "thingId": ThingId,
    "patch": {
        // Configuration patch
    }
}
```

### ConfigUpdate

This message contains updates for whichever system is holding the Thing's configuration information.

As an Update, it will replace the current configuration in its entirety and replace it with the one in the message.

```json
{
    "type": "ConfigPatch",
    "source": UUID,
    "thingId": ThingId,
    "patch": {
        // Configuration update
    }
}
```

## Multiple Configuration Sources

The GIoTTo architecture allows for any number of configuration sources. In a well-behaved system, each Thing will get `ConfigReport`s from just one of these sources. 

That said, life isn't perfect, so there needs to be a method for resolving any conflicts.

When a Thing gets `ConfigReport`s from more than one source, it decides which one it will treat as its system of record and tell the others to be quiet with a `ConfigQuiesce`:

```json
{
    "type": "ConfigQuiesce",
    "thingId": ThingId,
    "source": UUID
}
```

On receipt of this message, a configuration source should no longer respond to `ConfigRequest`s for the given `thingId`.

In the event that a `ConfigRequest` results in no response (within some timeout that the Thing chooses), a `ConfigCommence` can be sent out to remove any existing quiescence:

```json
{
    "type": "ConfigCommence",
    "thingId": ThingID
}
```

Any configuration source that picks up this message should start responding to `ConfigRequest`s, if it contains configuration information about the relevant Thing.