export type Params = Record<string,string|undefined>;

export type Middleware = (req: Request, res: Response, next: () => void,err?: any) => void;

export interface Request {
  method: string;
  url: string;
  headers: Record<string,string|string[]|undefined>;
  path: string;           // parsed pathname
  query: Record<string,string | string[] | undefined>; // parsed querystring
  params: Params;         // route params
  body?: any;             // after body parsing
  raw: import('http').IncomingMessage;
}

export interface Response {
  status(code: number): Response;
  set(field: string, value: string): Response;
  json(obj: any): void;
  send(body: string | Buffer | object): void;
  raw: import('http').ServerResponse;
  end(msg: string): void
}
