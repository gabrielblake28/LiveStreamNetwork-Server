import { Router } from "express";
import { INotificationClient } from "../Notification/def/INotificationClient";
import { NotificationKind } from "../Notification/def/NotificationKind";
import { MockNotificationClient } from "../Notification/impl/MockNotificationClient";
import { TwilioClientWrapper } from "../Notification/impl/TwilioClientWrapper";

let notificationClient: INotificationClient;

if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_NOTIFY_SID &&
    process.env.TWILIO_AUTH_TOKEN
) {
    notificationClient = new TwilioClientWrapper(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_NOTIFY_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
} else {
    //TODO FAIL GRACEFULLY IF THIS DOESNT WORK
    throw Error("NOTIFICATIONS ARE NOT WORKING");
}

notificationClient = new MockNotificationClient();

export const NotificationRouter = Router();

NotificationRouter.get("/", async (req, res) => {
    const result = await notificationClient.SendVerification(
        req.query.to as string,
        req.query.channel as NotificationKind
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

NotificationRouter.post("/", async (req, res) => {
    const result = await notificationClient.Verify(req.body.to, req.body.code);

    if (result) {
        res.status(200).send("Successfully verified phone");
    } else {
        res.status(400).send("failure");
    }
});
