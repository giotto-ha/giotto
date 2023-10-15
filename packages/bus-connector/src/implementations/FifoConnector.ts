import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Writable } from "node:stream";
import { BusConnector, BusMessage } from "../BusConnector.js";
import { JsonTransformStream } from "./JsonTransformStream.js";

export class FifoConnector implements BusConnector {
    private inputStream: Readable;
    private outputStream: Writable;
    private listeners: Map<string, (message: BusMessage) => void> = new Map();
    
    constructor(fifoName: string) {
        this.inputStream = createReadStream(fifoName).pipe(new JsonTransformStream());
        this.outputStream = createWriteStream(fifoName);

        this.inputStream.on("data", (data: {topic: string, message:BusMessage}) => {
            console.log('Received message', data)
            const listener = this.listeners.get(data.topic);
            console.log('Listener', listener)
            if (listener) {
                listener(data.message);
            }
        })
    }

    async listenTo (topic: string, callback: (message: BusMessage) => void){
        this.listeners.set(topic, callback);
    }

    async stopListeningTo (topic: string) {
        this.listeners.delete(topic);
    }

    sendMessage (topic: string, message: BusMessage) {
        return new Promise<void>((res, rej)=>this.outputStream.write(JSON.stringify({ topic, message }), (err)=> {
            if(err) {
                rej(err);
            } else {
                res();
            }
        }));
    }
}