import { Middleware, Request, Response } from "miniExpress/types";
import { executeMiddleware } from "../core/executeMiddleware";
import { logger } from "./utils/logger";
import { CORS } from "./security/cors";
import { miniHelmet } from "./security/helmet";
import { authorize } from "./security/authorization";
import { validate } from "./utils/validator";
import { rateLimit } from "./utils/rateLimiter";

const globalMiddleware: Middleware[] = [
  logger,
  CORS,
  miniHelmet,
];

const routeMiddleware: Middleware[] = [
  authorize,
  validate,
  rateLimit
];

export const globalChain = (req: Request, res: Response, finalHandler: () => void) =>
  executeMiddleware(globalMiddleware, req, res, finalHandler);

export const routeChain = (req: Request, res: Response, finalHandler: () => void) =>
  executeMiddleware(routeMiddleware, req, res, finalHandler);
