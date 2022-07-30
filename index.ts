import cors from "cors";
import express from "express";
import * as http from "http";
import twilio, { Twilio } from "twilio";
import { BatchTextNotificationStrategy } from "./server/Notification/impl/BatchTextNotificationStrategy";
import { MockNotificationClient } from "./server/Notification/impl/MockNotificationClient";
import { NotificationService } from "./server/Notification/impl/NotificationService";
import { TwilioClientWrapper } from "./server/Notification/impl/TwilioClientWrapper";
import { SubscriptionService } from "./server/Subscriptions/impl/SubscriptionService";
import axios from "axios";
import { UserRouter } from "./server/Routers/UserRouter";
import { EventRouter } from "./server/Routers/EventRouter";
import passport from "passport";
// import { uploadFile } from "./ThumbnailUpload/ThumbnailUploadService";
import { TwitchUserRouter } from "./server/Routers/TwitchUserRouter";
import { FileUploadRouter } from "./server/Routers/FileUploadRouter";
import { SubscriptionRouter } from "./server/Routers/SubscriptionRouter";
import { SearchRouter } from "./server/Routers/SearchRouter";
import { TestService } from "./server/TestService/impl/TestService";
import { NotificationKind } from "./server/Notification/def/NotificationKind";
// import prompt from "prompt";
import { NotificationRouter } from "./server/Routers/NotificationRouter";
import { MailGunEmailClient } from "./server/Notification/impl/MailgunEmailClient";
import { INotificationClient } from "./server/Notification/def/INotificationClient";
import { NotificationBroker } from "./server/Notification/impl/NotificationBroker";
import { EventService } from "./server/Event/impl/EventService";
import { NotificationFactory } from "./server/Notification/impl/NotificationFactory";
import { AuthRouter } from "./server/Routers/AuthRouter";
import { FeedbackRouter } from "./server/Routers/FeedbackRouter";

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// if (process.env.NODE_ENV !== "test") {
//     const firebaseConfig = {
//         apiKey: "AIzaSyBm0ecePCV-nzfphINVS3dH94Fmcon1T9Y",
//         authDomain: "twitchnotifications-9269f.firebaseapp.com",
//         projectId: "twitchnotifications-9269f",
//         storageBucket: "twitchnotifications-9269f.appspot.com",
//         messagingSenderId: "45571509695",
//         appId: "1:45571509695:web:e0fe9679997babada2650a",
//         measurementId: "G-YC3Z65V6RP",
//     };

//     getAnalytics(initializeApp(firebaseConfig));
// }

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const PORT = process.env.PORT || 3500;

// export const TwilioClient = new MockNotificationClient();

// const batchTextNotificationStrategy = new BatchTextNotificationStrategy(
//     ["+18635129916"],
//     "Some Generic Message",
//     TwilioClient
// );

// new SubscriptionService().BatchGetSubscriptions(["289"]);
// setInterval(() => {
//     batchTextNotificationStrategy.send();
// }, 300000);

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

app.use("/image_upload", FileUploadRouter);
app.use("/user", UserRouter);
app.use("/event", EventRouter);
app.use("/subscription", SubscriptionRouter);
app.use("/search", SearchRouter);
app.use("/notification", NotificationRouter);
app.use("/auth", AuthRouter);
app.use("/feedback", FeedbackRouter);


const testService = new TestService();

// console.time("CreateEvents");
// testService.DeleteEvents().then(() => {
//     testService.DeleteUsers().then(() => {
//         testService.DeleteSubscriptions().then(() => {
//             testService.CreateUsers(10000).then(() => {
//                 testService
//                     .CreateEvents(10000, new Date("2022-07-20"), true)
//                     .then(() => {
//                         testService.AddSubscriptions(500, 300).then(() => {
//                             console.timeEnd("CreateEvents");
//                         });
//                     });
//             });
//         });
//     });
// });

// const phone = "+18635129916";
// TwilioClient.SendVerification(phone, "sms").then((result) => {
//     console.log(result);

//     prompt.start();

//     prompt.get(["code"], function (err, result) {
//         if (err) {
//             console.log("Error");
//         } else {
//             TwilioClient.Verify(phone, result.code as string).then((res) =>
//                 console.log(res)
//             );
//         }
//     });
// });
// let client: INotificationClient;

// if (process.env.MAILGUN_SANDBOX_KEY && process.env.MAILGUN_SANDBOX_DOMAIN) {
//     client = new MailGunEmailClient(
//         process.env.MAILGUN_SANDBOX_KEY,
//         process.env.MAILGUN_SANDBOX_DOMAIN
//     );
//     client.send([], "");
// } else {
//     console.log(
//         process.env.MAILGUN_SANDBOX_KEY,
//         process.env.MAILGUN_SANDBOX_DOMAIN
//     );
// }

new NotificationBroker(
    new EventService(),
    new SubscriptionService(),
    new NotificationFactory()
).Initialize();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
