# Timekeeper

The Timekeeper keeper package is as very simple one. 

Its sole purpose is to provide the rest of the system with a consistent and shared view of the current time and date.

Once a second, it sends a message out on the bus indicating the current time, thus:

```
{
    epoch: number, // unix epoch in seconds
    datetime: string, // YYYYMMDDhhmmss
    timezone: string // per the tz database
}
```

[tz database](https://en.wikipedia.org/wiki/Tz_database)

The `datetime` is given in the configured timezone.

## Configuration

The configuration of the timekeeper is also simple. The timezone can be changed at any time and subsequent messages will reflect this.

## Topics

Timekeeper publishes to the `environment` topic. It subscribes and publishes to the `configuration` topic.

## Messages

### Outbound

The following messages are sent out by Timekeeper.

#### TimeReport

This goes out on the `environment` topic once a second.

```
{
    type: "TimeReport",
    thingId: number,
    epoch: number,
    datetime: string,
    timezone: string
}
```

#### ConfigRequest

This can be sent out by Timekeeper when it first comes online or after a restart to get the current configuration. It goes out on the `configuration` topic.

```
{
    type: "ConfigRequest",
    thingId: number
}
```

### Inbound

The following message is consumed by Timekeeper.

#### Config Report

This comes in on the `configuration` topic and tells the Timekeeper its current timezone.

```
{
    type: "ConfigReport",
    thingId: number,
    timezone: string
}
```
