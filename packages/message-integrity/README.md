# Message Integrity

It's important that the sources of messages can be verified.

GIoTTo uses a straight forward public/private key approach to signing messages.

The functions in this module do all the hard work.

`getKeys` will either read from a private keyfile (using either the `PRIVATE_KEY_FILE` environment variable to find the key file, or defaulting to `./private.key`).
If this file exists, the public key is generated from the contained private key. Otherwise, a new public/private key pair is created.

`sign` takes a `BusMessage` and a private key and adds the appropriate signature.

`validate` takes a signed `BusMessage` and a public key and makes sure that the signature is correct.