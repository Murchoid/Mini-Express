import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const rateLimit: Middleware = (req: Request, res: Response, next: any) => {
  // Example placeholder
  console.log("Rate limit check");
  next();
};
