import { jsonParser } from './core/middleware/body/jsonParser';
import {miniExpress} from './core/mini-express';
import { urleEncodedParser } from './core/middleware/body/urlEncodedParser';
import { errorHandler } from './core/middleware/chain';

const app = new miniExpress();

app.use(jsonParser);
app.use(urleEncodedParser);
app.use(errorHandler);

app.get('/', (req, res ) => {
    res.status(200).json({message: "Hello world!"});
});

app.get("/users/:id", (req, res) => {
  res.end(`User ID is ${req.params.id}`);
});

app.get("/users/:userId/messages/:messageId", (req, res) => {
  res.end(`User ${req.params.userId}, message ${req.params.messageId}`);
});

app.get("/search", (req, res) => {
    console.log(req.query);
    res.status(200).json({data: req.query});
})

app.post("/user", (req, res) => {
    res.status(200).json({data: req.body});
})

app.get("/fail", (req, res) => {
  setTimeout(() => {
    throw new Error("Boom!");
  }, 10);
});


app.listen(3000, () => {
    console.log("Server listening in port 3000");
});
