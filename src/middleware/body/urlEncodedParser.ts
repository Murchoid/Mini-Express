import { Middleware } from "types";

export const urleEncodedParser: Middleware = (req, res, next) => {
    if (req.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
        let data = "";
        req.raw.on("data", chunk => {
            data += chunk;
        })

        req.raw.on("end", () => {
            if (data.length > 0) {
                const params = new URLSearchParams(data);
                req.body = Object.entries(params);
            } else {
                req.body = {};
            }
            next();
        })
    }else {
        next();
    }

}