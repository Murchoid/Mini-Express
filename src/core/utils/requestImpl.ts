import { ServerResponse } from "http";
import { Response } from "types";

export class ResponseImpl implements Response {
  raw: ServerResponse;

  constructor(res: ServerResponse) {
    this.raw = res;
  }

  status(code: number): Response {
    this.raw.statusCode = code;
    return this;
  }

  set(field: string, value: string): Response {
    this.raw.setHeader(field, value);
    return this;
  }

  json(obj: any): void {
    this.raw.setHeader("Content-Type", "application/json");
    this.raw.end(JSON.stringify(obj));
  }

  send(body: string | Buffer | object): void {
    if (typeof body === "object" && !(body instanceof Buffer)) {
      this.json(body);
    } else {
      this.raw.end(body as any);
    }
  }

  end(msg: string): void {
    this.raw.end(msg);
  }
}
