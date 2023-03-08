import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send({ Hello: "World" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
