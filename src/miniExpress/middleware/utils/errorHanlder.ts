import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const errorHandler: Middleware = ( req: Request, res: Response, next, err: any) => {

  console.error("Error:", err);
  res.status(500);
  res.end("Internal Server Error");

};