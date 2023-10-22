import { describe, it, expect } from "@jest/globals";
import { validateMessage } from "./validate.js";
import { getKeys } from "./get-keys.js";
import { BusMessage } from "@giotto/bus-connector";

describe('validateMessage', () => {
    it('should validate a signature on a message', async () => {
        const keySet = await getKeys();

        const message: BusMessage = {
            type: "test",
            payload: "test",
            signature: 'VJX3B7EViLHPcc1HFV+MSnJBdQQGAo2PmxVwfMHznlun6C2pHkmWngpt8Tq1bkVE31fmZlzsyjxAt3woVmPCs+rXGW4neJe8e29E0pcFWi59LVzwN5pYQWa8fx6OAn9B3WFqVv9L/hM6nWr4rydvopqZAdi7I3qeGLb3BrURRAkif5KEiDzvPwc0OhPE3ZrI9U9QL23ieHtnhzaQZnciSl9E6Q1wndEJFN9dnVzjjlVKlHWZrCL9oJsSOqBUeFX2I6lQ0yTwdZVLPLZ3v4Ak9j3vC4SmyagmJ4rWRzfb80xy4uivmzneYWTE+mGjY9YosJGNCVaz89r0b1U/iHtMLg==',
        };

        const isValid = await validateMessage(message, keySet.publicKey);
        expect(isValid).toEqual(true);

    });
});