import { Middleware, Request, Response } from "types";
import { executeMiddleware } from "./executeMiddleware";

const logger: Middleware = (req: Request, res: Response, next) => {
  console.log(`${req.method} -> ${req.path}`);
  next();
};


const CORS: Middleware = (req: Request, res: Response, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
};

const miniHelmet: Middleware = (req: Request, res: Response, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("X-XSS-Protection", "1; mode=block");
  next();
};


export const errorHandler: Middleware = ( req: Request, res: Response, next, err: any) => {

  console.error("Error:", err);
  res.status(500);
  res.end("Internal Server Error");

};

// Route specific
const authorize: Middleware = (req: Request, res: Response, next) => {
  if (!req.headers["authorization"]) {
    res.status(401);
    res.end("Unauthorized");
    return;
  }
  next();
};

const validate: Middleware = (req: Request, res: Response, next) => {
  if (!req.body || !req.body.data) {
    res.status(400);
    res.end("Bad Request: Missing data");
    return;
  }
  next();
};

const rateLimit: Middleware = (req: Request, res: Response, next) => {
  // Example placeholder
  console.log("Rate limit check");
  next();
};

const globalMiddleware: Middleware[] = [
  logger,
  CORS,
  miniHelmet,
];

const routeMiddleware: Middleware[] = [authorize, validate, rateLimit];

export const globalChain = (req: Request, res: Response, finalHandler: () => void) =>
  executeMiddleware(globalMiddleware, req, res, finalHandler);

export const routeChain = (req: Request, res: Response, finalHandler: () => void) =>
  executeMiddleware(routeMiddleware, req, res, finalHandler);
