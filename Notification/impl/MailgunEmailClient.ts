import { INotificationClient } from "../def/INotificationClient";
import { NotificationKind } from "../def/NotificationKind";
import Mailgun from "mailgun-js";

export class MailGunEmailClient implements INotificationClient {
    private mailClient: Mailgun.Mailgun;
    constructor(apiKey: string, domain: string) {
        this.mailClient = new Mailgun({ apiKey: apiKey, domain: domain });
    }
    async send(to: string[], body: string): Promise<boolean> {
        return await this.mailClient
            .messages()
            .send({
                from: "Excited User <me@samples.mailgun.org>",
                to: "gabriel.blake28@gmail.com",
                subject: "you suck",
                text: "Alot",
            })
            .then((res) => true)
            .catch((err) => false);
    }

    SendVerification(to: string, channel: NotificationKind): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    Verify(to: string, code: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
