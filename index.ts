import cors from "cors";
import express, { response } from "express";
import * as http from "http";
import axios from "axios";
import { UserRouter } from "./Routers/UserRouter";
import passport from "passport";
const request = require("request");
const session = require("express-session");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
// const passport       = require("passport");
// const twitchStrategy = require("passport-twitch-new").Strategy;

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT || 3500;

const Client_ID = "cyg0w4xnvmd6qc81l3q6i31zsppy40";
const Client_Secret = "246hkyxoq3i0oxb4eqez5l0fg3kfib";
const Session_Secret = "testsecret";
const Callback_URL = "http://localhost:3500/auth/twitch/callback";
let Code = "";
let AT = "";
let RFT = "";

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: "secretToken" }));
app.use(passport.initialize());
app.use(express.json());
app.use(cors());

// const getCode = (url: string, callback: any) => {
//     const options = {
//         url: "https://id.twitch.tv/oauth2/token",
//         json: true,
//         body: {
//             Client_ID: Client_ID,
//             Client_Secret: Client_Secret,
//             code: "w0jmu103l7r97eermc4e0vzmx1wpli",
//             grant_type: "client_credentials",
//             redirect_uri: Callback_URL,
//         },
//     };
//     request.post(options, (err: any, res: any, body: any) => {
//         if (err) {
//             return console.log(err);
//         }
//         console.log(`Status : ${res.statusCode}`);
//         console.log(body);

//         callback(res);
//     });
// };

// let AT = "";
// getCode("https://id.twitch.tv/oauth2/token", (res: any) => {
//     AT = res.body.access_token;
//     return AT;
// });

app.get(
    "/auth/twitch",
    passport.authenticate("", { scope: "user:read:email" })
);

// Set route for OAuth redirect
app.get("/auth/twitch/callback", (req, res) => {
    Code = String(req.query.code);
    console.log(Code);
});

const getTokens = (accessToken: string, callback: any) => {
    const options = {
        url: "https://id.twitch.tv/oauth2/token",
        json: true,
        body: {
            Client_ID: Client_ID,
            Client_Secret: Client_Secret,
            code: accessToken,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3500/auth/twitch/callback",
        },
    };
    request.post(options, (err: any, res: any, body: any) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status : ${res.statusCode}`);
        console.log(body);
        AT = res.body.access_token;
        RFT = res.body.refresh_token;

        callback(res);

        setTimeout(() => {
            console.log(AT);
            console.log(RFT);
        }, 2000);
    });
};

setTimeout(() => {
    getTokens(Code, (response: any) => {});
}, 2000);

function getUser(url: string, accessToken: string, callback: Function) {
    const userOptions = {
        url: url,
        method: "GET",
        headers: {
            "Client-ID": Client_ID,
            Authorization: "Bearer " + accessToken,
        },
    };

    request.get(userOptions, (err: any, res: any, body: any) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        console.log(JSON.parse(body));
    });
}

setTimeout(() => {
    getUser("https://api.twitch.tv/helix/users", AT, (response: any) => {});
}, 4000);

app.use("/user", UserRouter);
