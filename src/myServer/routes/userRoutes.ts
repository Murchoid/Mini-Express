import { Router } from "../../miniExpress/core";
import { Request, Response } from "../../miniExpress/types";
import { UserController } from "../controllers/users.controllers";

const router = new Router();
const userController = new UserController();

router.get("/:userId", (req: Request, res: Response ) => {
  const id = req.params.userId;
  let user = userController.findUser(id!);
  if(user) {
    res.status(200).json({status: "success", data: user});
  } else {
    res.status(404).json({status: "fail", message: "Not found"});
  }
});

router.get("/search", (req: Request, res: Response ) => {
  const query: unknown = req.query;
  let user = userController.findUser(query as string);
  if(user) {
    res.status(200).json({status: "success", data: user});
  }else {
    res.status(404).json({status: "fail", message: "Not found"});
  }
})

router.get("/", (req: Request, res: Response ) => {
    let users = userController.findAll();
    if(users) {
      res.status(200).json({status: "success", data: users});
    } else {
      res.status(404).json({status: "fail", message: "Not found"});
    }
})

router.post("/", (req: Request, res: Response ) => {
    const user = req.body;
    let savedUser = userController.saveUser(user);
    if(savedUser) {
      res.status(200).json({status: "success", data: savedUser});
    } else {
      res.status(404).json({status: "fail", message: "Not found"});
    }
})

export default router;