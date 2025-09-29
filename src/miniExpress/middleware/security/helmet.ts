import { Middleware } from "miniExpress/types";
import { Request, Response } from "miniExpress/types";

export const miniHelmet: Middleware = (req: Request, res: Response, next: any) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("X-XSS-Protection", "1; mode=block");
  next();
};