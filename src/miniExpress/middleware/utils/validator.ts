import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const validate: Middleware = (req: Request, res: Response, next: any) => {
  if (!req.body || !req.body.data) {
    res.status(400);
    res.end("Bad Request: Missing data");
    return;
  }
  next();
};