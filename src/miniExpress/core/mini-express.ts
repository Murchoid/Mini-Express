import { Middleware } from "../types";
import http from 'http'
import { ResponseImpl } from "../utils/requestImpl";
import { createRequest } from "../utils/createRequest";
import { executeMiddleware } from "./executeMiddleware";
import { Router } from "./router";
import { Request, Response } from "../types";
import { matchPaths } from "../utils/matchPaths";

export class miniExpress {

    private middlewares: Middleware[] = [];
    private routes: { method: string; path: string; middlewares: Middleware[]; handler: Middleware }[] = [];

    public use(path: string, handler: Middleware | Router): void;
    public use(handler: Middleware | Router): void;

    public use(arg1: string | Middleware | Router, arg2?: Middleware | Router): void {
        if (typeof arg1 === "string") {
            const path = arg1;
            const handler = arg2!;
            this.middlewares.push((req: Request, res: Response, next:(err ?: any) => void) => {
                if (req.path.startsWith(path)) {
                    if (typeof handler === "function") {
                        (handler as any)(req, res, next);
                    } else {
                        handler.handle(req, res, next);
                    }
                } else {
                    next();
                }
            });
        } else {
            const handler = arg1;
            if (typeof handler === "function") {
                this.middlewares.push(handler);
            } else {
                this.middlewares.push((req: Request, res: Response, next: ()=> void) =>
                    handler.handle(req, res, next)
                );
            }
        }
    }


    public get(path: string, ...handlers: Middleware[]) {
        const middlewares = handlers.slice(0, -1);
        const handler = handlers[handlers.length - 1];

        this.routes.push({
            method: "GET",
            path,
            middlewares,
            handler
        });
    }

    public post(path: string, ...handlers: Middleware[]) {
        const middlewares = handlers.slice(0, -1);
        const handler = handlers[handlers.length - 1];

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

    private handleRequest(req: any, res: any) {
        const request = createRequest(req);
        const response = new ResponseImpl(res);
        executeMiddleware(this.middlewares, request, response, () => {
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
                response.status(404).end("Not Found!");
                return;
            }

            request.params = matchedRoute.params;

            executeMiddleware(matchedRoute.middlewares, request, response, () => {
                const next = (err?: any) => {
                    if (err) {
                        executeMiddleware(this.middlewares, request, response, () => { }, err);
                    } else {
                        try {
                            matchedRoute.handler(request, response, next);
                        } catch (err) {
                            executeMiddleware(this.middlewares, request, response, () => { }, err);
                        }
                    }
                };

                next();
            });

        });
    }

}