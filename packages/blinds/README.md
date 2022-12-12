# Blinds

There isn't a lot of definitive information out on the Internet about how to communicate with motorized blinds, but here's what I've been able to cobble together.

## Gateway/Mobile App

You're not going to be talking directly to the blinds. Instead, you'll be talking to a WLAN bridge that came with your blinds. It's probably a
little USB dongle type thing that's plugged into a power socket.

The first step is to get that configured using whatever mobile app your blinds company uses. As far as I can tell, they're all basically skins over the
same basic structure, so it doesn't really matter which one you are using.

Here's some good news: you don't need to know the IP address of the gateway. The blinds use UDP multicast, which means you just talk to a specific IP address and the
gateway will pick it up.

## Authentication

Authentication is done via a generated AccessToken that requires two components, a `token` and a `key`.

The `token`, comes from the gateway itself. You send out a `GetDeviceList` message (this does not need authentication) and the response will include the `token`.

The `key` comes from the app. Open it up and,click the 3 dots in the top right corner. Go to “settings”, go to “About”. _Quickly_ tap the screen 5 times, and a popup will appear that gives you the key.

To generate the token, you need to combine them with AES Encryption, 128-bits in ECB mode. A simple Node example would be:

```javascript
import { createCipheriv } from "node:crypto";

const aes = createCipheriv("aes-128-ecb", key, Buffer.from(""));

const AccessToken = Buffer.concat([aes.update(token), aes.final()])
  .toString("hex")
  .toUpperCase()
  .slice(0, 32);
```

## Communication

As noted above, communication with the gateway is via (UDP multicast)[https://en.wikipedia.org/wiki/Multicast]. The multicast address is `238.0.0.18`.

Messages come in on port `32101` and go out on port `32100`.

Messages are in JSON format and outlined in the API reference below.

A simple implementation in Node might be:

```javascript
import { createSocket } from "node:dgram";

const MULTICAST_ADDRESS = "238.0.0.18";

const socket = createSocket("udp4");

socket.bind(32101, () => {
  socket.addMembership(MULTICAST_ADDRESS);
  socket.setBroadcast(true);
});

const message = {
  /* as needed */
};

socket.send(
  JSON.stringify(message),
  32100,
  MULTICAST_ADDRESS,
  (error, bytesSent) => {
    // Handle error
  }
);

socket.on("message", (messageInJsonFormat) => {
  // Handle message
});
```

## References

- (Motion Blind API)[https://api.library.loxone.com/downloader/file/491/Motion-Blind-API-integration.pdf]
- (Loxone Library)[https://library.loxone.com/]
