/**
 * In this folder MyServer, I try to simmulate how I would normally user express after installing it
 * So i try to mimic the most common things i do in a small project and try to implement them
 * at least to seem like I am using express,
 * 
 */


import {miniExpress} from '../miniExpress/core/mini-express';
import { jsonParser } from '../miniExpress/middleware/body/jsonParser';
import { urleEncodedParser } from '../miniExpress/middleware/body/urlEncodedParser';
import { errorHandler } from '../miniExpress/middleware/utils/errorHanlder';
import { Request, Response } from '../miniExpress/types';
import userRoutes from './routes/userRoutes';

const app = new miniExpress();

app.use(jsonParser);
app.use(urleEncodedParser);
app.use(errorHandler);

app.use("/users", userRoutes);

app.get('/', (req: Request, res: Response ) => {
    res.status(200).json({message: "Hello world!"});
});


app.get("/fail", (req: Request, res: Response , next: any) => {
  setTimeout(() => {
    next (new Error("Boom!"));
  }, 10);
});

app.get("/async-fail", async (req: Request, res: Response , next: any) => {
  throw new Error("Boom async error!");
});

app.listen(3000, () => {
    console.log("Server listening in port 3000");
});
