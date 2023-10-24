import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Writable } from "node:stream";
import { BusConnector, BusMessage } from "../BusConnector.js";
import { JsonTransformStream } from "./JsonTransformStream.js";

export class FifoConnector implements BusConnector {
    private inputStream: Readable;
    private outputStream: Writable;
    private listeners: Map<string, <T extends string>(message: BusMessage<T>) => void> = new Map();
    
    constructor(fifoName: string) {
        this.inputStream = createReadStream(fifoName).pipe(new JsonTransformStream());
        this.outputStream = createWriteStream(fifoName);

        this.inputStream.on("data", <T extends string>(data: {topic: string, message:BusMessage<T>}) => {
            console.log('Received message', data)
            const listener = this.listeners.get(data.topic);
            console.log('Listener', listener)
            if (listener) {
                listener(data.message);
            }
        })
    }

    async listenTo (topic: string, callback: <T extends string>(message: BusMessage<T>) => void){
        this.listeners.set(topic, callback);
    }

    async stopListeningTo (topic: string) {
        this.listeners.delete(topic);
    }

    sendMessage <T extends string>(topic: string, message: BusMessage<T>) {
        return new Promise<void>((res, rej)=>this.outputStream.write(JSON.stringify({ topic, message }), (err)=> {
            if(err) {
                rej(err);
            } else {
                res();
            }
        }));
    }
}