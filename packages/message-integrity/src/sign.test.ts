import { describe, it, expect } from "@jest/globals";
import { signMessage } from "./sign.js";
import { getKeys } from "./get-keys.js";
import { BusMessage, Unsigned } from "@giotto/bus-connector";

interface TestMessage extends BusMessage<"test"> {
    type: "test";
    payload: string;
}
describe('sign', () => {
    it('should add a signature to a message', async () => {
        const keySet = await getKeys();

        const message: Unsigned<TestMessage> = {
            type: "test",
            payload: "test",
        };

        const signedMessage = await signMessage(message, keySet.privateKey);
        expect(signedMessage).toHaveProperty('signature');
        expect(signedMessage.signature).toEqual('VJX3B7EViLHPcc1HFV+MSnJBdQQGAo2PmxVwfMHznlun6C2pHkmWngpt8Tq1bkVE31fmZlzsyjxAt3woVmPCs+rXGW4neJe8e29E0pcFWi59LVzwN5pYQWa8fx6OAn9B3WFqVv9L/hM6nWr4rydvopqZAdi7I3qeGLb3BrURRAkif5KEiDzvPwc0OhPE3ZrI9U9QL23ieHtnhzaQZnciSl9E6Q1wndEJFN9dnVzjjlVKlHWZrCL9oJsSOqBUeFX2I6lQ0yTwdZVLPLZ3v4Ak9j3vC4SmyagmJ4rWRzfb80xy4uivmzneYWTE+mGjY9YosJGNCVaz89r0b1U/iHtMLg==');
    });
});