import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const authorize: Middleware = (req: Request, res: Response, next) => {
  if (!req.headers["authorization"]) {
    res.status(401);
    res.end("Unauthorized");
    return;
  }
  next();
};
