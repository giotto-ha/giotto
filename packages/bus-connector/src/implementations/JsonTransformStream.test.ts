import { describe, it, expect } from "@jest/globals";
import { AssertionError } from "assert";
import { JsonTransformStream } from "./JsonTransformStream";

const streamTest = (
  { writtenData, expected }: { writtenData: string[]; expected: object[] },
  done: (e?: Error) => void
) => {
  let expectationCursor = 0;
  const stream = new JsonTransformStream();
  stream.on("data", (data) => {
    try {
      expect(data).toEqual(expected[expectationCursor]);
      expectationCursor++;
    } catch (error) {
      done(error as Error);
    }
  });
  stream.on("error", (error) => {
    done(
      new AssertionError({
        message: `Stream threw an error: ${(error as Error).message}`,
      })
    );
  });
  stream.on("close", () => {
    try {
      expect(expectationCursor).toEqual(expected.length);
      done();
    } catch (error) {
      done(error as Error);
    }
  });
  for (const data of writtenData) {
    stream.write(data);
  }

  stream.end();
};

describe("JsonTransformStream", () => {
  it("can be instantiated", () => {
    const stream = new JsonTransformStream();
    expect(stream).toBeDefined();
  });
  it("can parse a single json object", (done) => {
    streamTest(
      {
        writtenData: [`{"foo":"bar"}`],
        expected: [{ foo: "bar" }],
      },
      done
    );
  });
  it("can parse a consecutive json objects", (done) => {
    streamTest(
      {
        writtenData: [`{}{}`],
        expected: [{}, {}],
      },
      done
    );
  });
  it("handles an object spread over two chunks", (done) => {
    streamTest(
      {
        writtenData: [`{ "test":`, `"string"}`],
        expected: [{ test: "string" }],
      },
      done
    );
  });
  it("handles an object spread over three chunks", (done) => {
    streamTest(
      {
        writtenData: [`{ "test":`, `"stri`, `ng"}`],
        expected: [{ test: "string" }],
      },
      done
    );
  });
  it("can handle irrelevant whitespace", (done) => {
    streamTest(
      {
        writtenData: [`    {}   {  }   `],
        expected: [{}, {}],
      },
      done
    );
  });
  it("does not remove relevant whitespace", (done) => {
    streamTest(
      {
        writtenData: [`{ "test":"  `, `  string"}`],
        expected: [{ test: "    string" }],
      },
      done
    );
  });
  it("can handle objects containing objects", (done) => {
    streamTest(
      {
        writtenData: [`{"foo":{"bar":"baz"}}`],
        expected: [{ foo: { bar: "baz" } }],
      },
      done
    );
  });
  it('can handle strings that contain "}"', (done) => {
    streamTest(
      {
        writtenData: [`{"foo":"}"}`],
        expected: [{ foo: "}" }],
      },
      done
    );
  });
  it("ignores leading garbage", (done) => {
    streamTest(
      {
        writtenData: [`garbage{"foo":"bar"}`],
        expected: [{ foo: "bar" }],
      },
      done
    );
  });
  it("ignores trailing garbage", (done) => {
    streamTest(
      {
        writtenData: [`{"foo":"bar"}garbage`],
        expected: [{ foo: "bar" }],
      },
      done
    );
  });
});
