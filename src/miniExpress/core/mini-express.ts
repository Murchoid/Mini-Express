import { Middleware, RegularMiddleware } from "../types";
import http from 'http'
import { ResponseImpl } from "../utils/requestImpl";
import { createRequest } from "../utils/createRequest";
import { executeMiddleware } from "./executeMiddleware";
import { Request, Response } from "../types";
import { matchPaths } from "../utils/matchPaths";
import { asyncHandler } from "../utils/asyncWrapper";

export class miniExpress {

    protected middlewares: Middleware[] = [];
    protected routes: { method: string; path: string; middlewares: Middleware[]; handler: Middleware }[] = [];

    public use(path: string, handler: Middleware | Router): void;
    public use(handler: Middleware | Router): void;

    public use(arg1: string | Middleware | Router, arg2?: Middleware | Router): void {
        if (typeof arg1 === "string") {
            const path = arg1;
            const handler = arg2!;

            if (handler instanceof Router) {
                // MOUNT THE ROUTER 
                this.mountRouter(path, handler);
            } else {
                // Regular middleware with path prefix
                this.middlewares.push((req: Request, res: Response, next: (err?: any) => void) => {
                    if (req.path.startsWith(path)) {
                        // Store original path and temporarily adjust for middleware
                        const originalPath = req.path;
                        (req as any).path = originalPath.slice(path.length) || '/';

                        (handler as any)(req, res, (err?: any) => {
                            // Restore original path
                            (req as any).path = originalPath;
                            next(err);
                        });
                    } else {
                        next();
                    }
                });
            }

        } else {
            const handler = arg1;
            if (handler instanceof Router) {
                // Mount router at root path
                this.mountRouter("/", handler);
            } else {
                // Global middleware
                this.middlewares.push(handler);
            }
        }
    }

    private mountRouter(basePath: string, router: Router): void {
        // Add all routes from the router with the base path prefix
        router.routes.forEach(route => {
            const prefixedPath = this.normalizePath(basePath + route.path);
            this.routes.push({
                ...route,
                path: prefixedPath
            });
        });

        // Also add the router's middlewares with path prefix
        router.middlewares.forEach(middleware => {
            this.middlewares.push((req: Request, res: Response, next: (err?: any) => void) => {
                if (req.path.startsWith(basePath)) {
                    const originalPath = req.path;
                    (req as any).originalPath = originalPath;
                    (req as any).path = originalPath.slice(basePath.length) || '/';

                    (middleware as RegularMiddleware )(req, res, (err?: any) => {
                        (req as any).path = originalPath;
                        next(err);
                    });
                } else {
                    next();
                }
            });
        });
    }

    private normalizePath(path: string): string {
        return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    }

    public get(path: string, ...handlers: Middleware[]) {
        const middlewares = handlers.slice(0, -1);
        let handler = handlers[handlers.length - 1];

        if (handler.constructor.name === "AsyncFunction") {
            handler = asyncHandler(handler);
        }

        this.routes.push({
            method: "GET",
            path,
            middlewares,
            handler
        });
    }

    public post(path: string, ...handlers: Middleware[]) {
        const middlewares = handlers.slice(0, -1);
        let handler = handlers[handlers.length - 1];

        if (handler.constructor.name === "AsyncFunction") {
            handler = asyncHandler(handler);
        }

        this.routes.push({
            method: "POST",
            path,
            middlewares,
            handler
        });
    }

    public listen(port: number, handler: () => void) {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, handler);
    }

    protected handleRequest(req: any, res: any, next?: (err?: any) => void) {
        const request = createRequest(req);
        const response = new ResponseImpl(res);

        console.log(this.routes);
        // First execute global middlewares
        executeMiddleware(this.middlewares, request, response, () => {
            // Then try to find matching route
            let matchedRoute: any = null;

            for (const route of this.routes) {
                if (route.method === request.method) {
                    const { matched, params } = matchPaths(request.path, route.path);
                    if (matched) {
                        matchedRoute = { ...route, params };
                        break;
                    }
                }
            }

            if (!matchedRoute) {
                if (next) return next(); 
                response.status(404).end("Not Found!");
                return;
            }

            request.params = matchedRoute.params;

            // Execute route-specific middlewares and then the handler
            executeMiddleware(matchedRoute.middlewares, request, response, () => {
                try {
                    matchedRoute.handler(request, response, (err?: any) => {
                        if (err) {
                            // Look for error handling middlewares
                            const errorMiddlewares = this.middlewares.filter(m => m.length === 4);
                            if (errorMiddlewares.length > 0) {
                                executeMiddleware(errorMiddlewares, request, response, () => {
                                    response.status(500).json({ error: "Unhandled Error" });
                                }, err);
                            } else {
                                response.status(500).json({ error: "Internal Server Error" });
                            }
                        }
                    });
                } catch (err) {
                    const errorMiddlewares = this.middlewares.filter(m => m.length === 4);
                    if (errorMiddlewares.length > 0) {
                        executeMiddleware(errorMiddlewares, request, response, () => {
                            response.status(500).json({ error: "Unhandled Error" });
                        }, err);
                    } else {
                        response.status(500).json({ error: "Internal Server Error" });
                    }
                }
            });
        });
    }
}

export class Router extends miniExpress {}