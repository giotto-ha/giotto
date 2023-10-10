export interface BusMessage {
    type: string;
    signature: string;
    [key: string]: any;
}

export interface BusConnector {
    listenTo: (topic: string, callback: (message: BusMessage) => void) => void;
    stopListeningTo: (topic: string) => void;
    sendMessage: (topic: string, message: BusMessage) => void;
}