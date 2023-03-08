import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

app.get("/", (req: Request, res: Response) => {
    res.send({ Hello: "World" });
});

app.get("/video", (req: Request, res: Response) => {
    res.send({
        video: {
            thumbnail: "https://media.vimejs.com/poster.png",
            url: "https://media.vimejs.com/720p.mp4",
            type: "video/mp4",
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
