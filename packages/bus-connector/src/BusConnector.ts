export interface BusMessage {
    type: string;
    signature: string;
    [key: string]: any;
}

export interface BusConnector {
    listenTo: (topic: string, callback: (message: BusMessage) => void) => Promise<void>;
    stopListeningTo: (topic: string) => Promise<void>;
    sendMessage: (topic: string, message: BusMessage) => Promise<void>;
}

export const isBusMessage = (message: any): message is BusMessage => {
    return typeof message === "object" && message !== null && "type" in message && "signature" in message;
}   