import { Middleware } from "../types";
import { executeMiddleware } from "./executeMiddleware";
import { matchPaths } from "../utils/matchPaths";

export class Router {
    private middlewares: Middleware[] = [];
    private routes: { method: string; path: string; middlewares: Middleware[]; handler: Middleware }[] = [];

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

    public use(middleware: Middleware) {
        this.middlewares.push(middleware);
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

    
    public handle(req: any, res: any, next: ()=> void) {
            executeMiddleware(this.middlewares, req, res, () => {
                let matchedRoute: any = null;
    
                for (const route of this.routes) {
                    if (route.method === req.method) {
                        const { matched, params } = matchPaths(req.path, route.path);
                        if (matched) {
                            matchedRoute = { ...route, params };
                            break;
                        }
                    }
                }
    
                if (!matchedRoute) {
                    res.status(404).end("Not Found!");
                    return;
                }
    
                req.params = matchedRoute.params;
    
                executeMiddleware(matchedRoute.middlewares, req, res, () => {
                    const next = (err?: any) => {
                        if (err) {
                            executeMiddleware(this.middlewares, req, res, () => { }, err);
                        } else {
                            try {
                                matchedRoute.handler(req, res, next);
                            } catch (err) {
                                executeMiddleware(this.middlewares, req, res, () => { }, err);
                            }
                        }
                    };
    
                    next();
                });
    
            });
        }

}