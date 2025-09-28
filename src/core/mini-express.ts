import { Middleware } from "types";
import http from 'http'
import { ResponseImpl } from "./utils/requestImpl";
import { createRequest } from "./utils/createRequest";
import { executeMiddleware } from "./middleware/executeMiddleware";

export class miniExpress {

    private middlewares: Middleware[]= [];
    private routes: { method: string; path: string; middlewares: Middleware[]; handler: Middleware }[] = [];

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
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

    private matchPaths(requestPath: string, routePath: string) {
        const routeSegment = routePath.split("/").filter(Boolean);
        const requestSegment = requestPath.split("/").filter(Boolean);

        const params: Record<string, string> = {};

        if (routeSegment.length !== requestSegment.length) {
            return { matched: false, params: {} };
        }

        for (let i = 0; i < routeSegment.length; i++) {
            const routePart = routeSegment[i];
            const reqPart = requestSegment[i];

            if (routePart.startsWith(":")) {
                const paramName = routePart.slice(1);
                params[paramName] = reqPart;
            } else if (routePart !== reqPart) {
                return { matched: false, params: {} };
            }
        }

        return {
            matched: true,
            params
        }
    }

    private handleRequest(req: any, res: any) {
        const request = createRequest(req);
        const response = new ResponseImpl(res);

        executeMiddleware(this.middlewares, request, response, () => {
            let matchedRoute: any = null;

            for (const route of this.routes) {
                if (route.method === request.method) {
                    const { matched, params } = this.matchPaths(request.path, route.path);
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
                try {
                    matchedRoute.handler(request, response, () => { });
                } catch (err) {
                    executeMiddleware(this.middlewares, request, response, () => { }, err);
                }
            });
        });
    }

}