import { Socket } from "dgram";

export type SocketSendCallback = Exclude<Parameters<Socket["send"]>[3], undefined>;

export const getCallback = (
    callback?: SocketSendCallback
): { promise: null | Promise<number>; callback: SocketSendCallback; } => {
    if (callback !== undefined) {
        return { promise: null, callback };
    }

    let rs: (value: number) => void;
    let rj: (reason: Error) => void;
    const promise: Promise<number> = new Promise((resolve, reject) => {
        rs = resolve;
        rj = reject;
    });
    const cb: SocketSendCallback = (err: Error | null, bytes: number) => {
        if (err) {
            rj(err);
        } else {
            rs(bytes);
        }
    };

    return { promise, callback: cb };
};
