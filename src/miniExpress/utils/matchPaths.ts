export function matchPaths(reqPath: string, routePath: string) {
        const routeSegment = routePath.split("/").filter(Boolean);
        const reqSegment = reqPath.split("/").filter(Boolean);

        const params: Record<string, string> = {};

        if (routeSegment.length !== reqSegment.length) {
            return { matched: false, params: {} };
        }

        for (let i = 0; i < routeSegment.length; i++) {
            const routePart = routeSegment[i];
            const reqPart = reqSegment[i];

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
