import { Middleware } from "miniExpress/types";

export const jsonParser: Middleware = (req, res, next) => {
    if (req.headers["content-type"]?.includes("application/json")) {
        let data = "";

        req.raw.on("data", chunk => {
            data += chunk;
        })

        req.raw.on("end", () => {
            if (data.length > 0) {
                try {
                    req.body = JSON.parse(data);
                } catch (e) {
                    res.status(400).json({ error: "Invalid JSON" });
                    return;
                }
            } else {
                req.body = {};
            }
            next();
        })

        req.raw.on("error", () => {
            res.status(400).json({ error: "Error when trying to parse" });
        })
    }else {
        next();
    }

}