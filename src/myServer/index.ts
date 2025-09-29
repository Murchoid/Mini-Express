import { jsonParser } from '../miniExpress/middleware/body/jsonParser';
import {miniExpress} from '../miniExpress/core/mini-express';
import { urleEncodedParser } from '../miniExpress/middleware/body/urlEncodedParser';
import { errorHandler } from '../miniExpress/middleware/utils/errorHanlder';
import { Request, Response } from '../miniExpress/types';
import userRoutes from './routes/userRoutes';

const app = new miniExpress();

app.use(jsonParser);
app.use(urleEncodedParser);
app.use(errorHandler);

app.get('/', (req: Request, res: Response ) => {
    res.status(200).json({message: "Hello world!"});
});

app.use("/users", userRoutes);

app.get("/fail", (req: Request, res: Response , next: any) => {
  setTimeout(() => {
    next (new Error("Boom!"));
  }, 10);
});


app.listen(3000, () => {
    console.log("Server listening in port 3000");
});
