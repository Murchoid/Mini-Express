import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const CORS: Middleware = (req: Request, res: Response, next: any) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
};

