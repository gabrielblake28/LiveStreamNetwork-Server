import cors from "cors";
import express from "express";
import * as http from "http";
import axios from "axios";
import { UserRouter } from "./Routers/UserRouter";
import { EventRouter } from "./Routers/EventRouter";
import passport from "passport";
import { uploadFile } from "./AWS_Upload/ImageUpload";
import { TwitchUserRouter } from "./Routers/TwitchUserRouter";
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT || 3500;

// uploadFile(
//     "testAsmon.jpg",
//     "C:\\Users\\Gabriel\\Workspace\\MainProjects\\TWEFrontend\\src\\assets\\asmon.jpg"
// );

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: "secretToken" }));
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/auth/twitch/callback", async (req, res) => {
    const tokens = await getTokens((req.query?.code as string) || "");

    res.cookie("evently_access_token", tokens.data.access_token)
        .cookie("evently_refresh_token", tokens.data.refresh_token)
        .redirect("http://localhost:3000");
    console.log(tokens.data.access_token);
});

const getTokens = async (accessToken: string) => {
    return await axios.post("https://id.twitch.tv/oauth2/token", {
        Client_ID: process.env.TWITCH_CLIENT_ID,
        Client_Secret: process.env.TWITCH_SECRET,
        code: accessToken,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3500/auth/twitch/callback",
    });
};

app.use("/user", UserRouter);
app.use("/event", EventRouter);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
