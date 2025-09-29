import { Router } from "../../miniExpress/core/router";
import { Request, Response } from "../../miniExpress/types";

const router = new Router();

router.get("/users/:userId/messages/:messageId", (req: Request, res: Response ) => {
  res.end(`User ${req.params.userId}, message ${req.params.messageId}`);
});

router.get("/search", (req: Request, res: Response ) => {
    console.log(req.query);
    res.status(200).json({data: req.query});
})

router.get("/users/:id", (req: Request, res: Response ) => {
  res.end(`User ID is ${req.params.id}`);
});

router.post("/users", (req: Request, res: Response ) => {
    res.status(200).json({data: req.body});
})

export default router;