import { Transform, TransformCallback } from "node:stream";

export class JsonTransformStream extends Transform {
  private buffer: string = "";
  constructor(options?: import("stream").TransformOptions) {
    super({ ...options, decodeStrings: true, objectMode: true });
  }

  private processBuffer(callback: TransformCallback) {
    this.buffer = this.buffer.trimStart();
    const openingBracket = this.buffer.indexOf("{");
    if (openingBracket > 0) {
      console.warn("Buffer has invalid start, discarding buffer: ", this.buffer.substring(0, openingBracket));
      this.buffer = this.buffer.substring(openingBracket);
      callback(null);
      return;
    }

    let lastClosingBracket = this.buffer.lastIndexOf("}");
    while (lastClosingBracket > 0) {
      const json = this.buffer.substring(0, lastClosingBracket + 1);
      try {
        const parsed = JSON.parse(json);
        this.push(parsed);
        this.buffer = this.buffer.substring(lastClosingBracket + 1);
      } catch (e) {
        if (!(e instanceof SyntaxError)) {
          callback(e instanceof Error ? e : new Error(`${e}`));
        }
      }
      lastClosingBracket = this.buffer.lastIndexOf("}", lastClosingBracket - 1);
    }

    callback(null);
  }

  override _transform(
    chunk: string,
    _: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.buffer = `${this.buffer}${chunk}`.trimStart();
    this.processBuffer(callback);
  }

  override _flush(callback: TransformCallback): void {
    this.processBuffer(callback);
    if (this.buffer.trimStart().length > 0) {
      console.warn("Buffer has invalid end, discarding buffer: ", this.buffer);
      this.buffer = "";
    }
  }
}
