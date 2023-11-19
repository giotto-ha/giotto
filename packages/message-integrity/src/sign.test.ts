import { BusMessage, Unsigned } from "@giotto/bus-connector";
import { describe, expect, it } from "@jest/globals";
import { getKeys } from "./get-keys.js";
import { signMessage } from "./sign.js";

interface TestMessage extends BusMessage<"test"> {
  type: "test";
  payload: string;
}
describe("sign", () => {
  it("should add a signature to a message", async () => {
    const keySet = await getKeys();

    const message: Unsigned<TestMessage> = {
      type: "test",
      payload: "test",
    };

    const signedMessage = await signMessage(message, keySet.privateKey);
    expect(signedMessage).toHaveProperty("signature");
    expect(signedMessage.signature).toEqual(
      "jc0iCHRhQPKoX7oTPtthScmrPad31ziE8/p9bM5P1IQ="
    );
  });
});
