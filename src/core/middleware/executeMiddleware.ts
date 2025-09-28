import { Middleware, Request, Response } from "types";

export const executeMiddleware = (
  middlewares: Middleware[],
  req: Request,
  res: Response,
  finalHandler: () => void,
  error: any = null
) => {
  let index = 0;

  const run = (err?: any) => {
    const isError = err != null;

    while (index < middlewares.length) {
      const middleware = middlewares[index++];

      // error case: only run error middlewares (4 args)
      if (isError && middleware.length === 4) {
        middleware(req, res, run, err);
        return;
      }

      // normal case: only run regular middlewares ( <= 3 args)
      if (!isError && middleware.length < 4) {
        middleware(req, res, run);
        return;
      }

      // otherwise: skip this middleware and continue loop
    }

    // if no middleware handled it
    if (isError) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      finalHandler();
    }
  };

  run(error);
};
