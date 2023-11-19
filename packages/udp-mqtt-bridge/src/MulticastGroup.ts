import { Socket, createSocket } from "node:dgram";
import { EventEmitter } from "node:stream";
import { SocketSendCallback, getCallback } from "./SocketSendCallback.js";

export class MulticastGroup<M extends object> extends EventEmitter {
  private _address: string;
  private _port: number;
  private _interface: string;
  private _group: string;
  private _socket: Socket;
  private _connected: boolean = false;
  private _pendingMessages: { message: M; callback: SocketSendCallback }[] = [];

  constructor(props: {
    address: string;
    port: number;
    interface: string;
    group: string;
  }) {
    super();
    this._address = props.address;
    this._port = props.port;
    this._interface = props.interface;
    this._group = props.group;
    this._socket = createSocket("udp4");
  }

  private handleMessage(buffer: Buffer, rinfo: string): void {
    try {
      const msg = JSON.parse(buffer.toString());
      this.emit("message", msg, rinfo);
    } catch (e) {
      const err = new Error("Received invalid message");
      this.emit("error", err);
    }
  }

  public connect(): Promise<boolean> {
    if (this._connected) {
      return Promise.resolve(true);
    }

    this._socket.addMembership(this._group, this._interface);
    this._socket.setBroadcast(true);

    return new Promise((res) => {
      this._socket.bind(this._port, () => {
        this._connected = true;
        res(true);
        this._processPendingMessages();

        this._socket.on("message", this.handleMessage);

        this._socket.on("close", () => {
          this._connected = false;
          this.off("message", this.handleMessage);
        });
      });
    });
  }

  public disconnect(): void {
    this._socket.close();
  }

  public purge(): void {
    this._pendingMessages = [];
  }

  get address(): string {
    return this._address;
  }

  get port(): number {
    return this._port;
  }

  get interface(): string {
    return this._interface;
  }

  get group(): string {
    return this._group;
  }

  private _processPendingMessages(): void {
    let next;
    if (!this._connected) {
      return;
    }

    while ((next = this._pendingMessages.shift())) {
      this._socket.send(
        JSON.stringify(next.message),
        this._port,
        next.callback
      );
    }
  }

  public sendMessage(
    message: M,
    callback?: SocketSendCallback
  ): Promise<number> | null {
    const cb = getCallback(callback);
    this._pendingMessages.push({ message, callback: cb.callback });

    this._processPendingMessages();

    return cb.promise;
  }
}
