export interface BusMessage<T extends string = string> {
    readonly type: T;
    readonly signature: string;
}

export type Unsigned<M extends BusMessage<T>, T extends string =  string> = Omit<M, "signature">;

export interface BusConnector {
    listenTo: (topic: string, callback: <T extends string>(message: BusMessage<T>) => void) => Promise<void>;
    stopListeningTo: (topic: string) => Promise<void>;
    sendMessage: <T extends string>(topic: string, message: BusMessage<T>) => Promise<void>;
}

export const isBusMessage = <T extends string>(message: any): message is BusMessage<T> => {
    return typeof message === "object" && message !== null && "type" in message && "signature" in message;
}   