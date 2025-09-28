import { IncomingMessage } from "http";
import { parse } from "url";
import { Request } from "../../types";

export const createRequest = (req: IncomingMessage): Request => {
  const { pathname, query } = parse(req.url || "", true);

  return {
    method: req.method || "GET",
    url: req.url || "/",
    headers: req.headers,
    path: pathname || "/",
    query: query as Record<string, string | string[] | undefined>,
    params: {}, // to be filled when routing
    body: undefined, // bodyParser will populate this
    raw: req,
  };
};
