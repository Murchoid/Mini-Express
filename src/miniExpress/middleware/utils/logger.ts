import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const logger: Middleware = (req: Request, res: Response, next: any) => {
  console.log(`${req.method} -> ${req.path}`);
  next();
};
