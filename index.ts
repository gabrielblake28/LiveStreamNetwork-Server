import cors from "cors";
import express from "express";
import * as http from "http";
import { UserRouter } from "./Routers/UserRouter";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT || 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use("/user", UserRouter);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
