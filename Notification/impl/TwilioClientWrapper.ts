import twilio from "twilio";
import { INotificationClient } from "../def/INotificationClient";

export class TwilioClientWrapper implements INotificationClient {
    client: any;
    serviceSID: string;

    constructor(accountSID: string, serviceSID: string, authToken: string) {
        this.client = twilio(accountSID, authToken);

        this.serviceSID = serviceSID;
    }
    async create(notificationOptions: {
        toBinding: string[];
        body: string;
    }): Promise<void> {
        await this.client.notify
            .services(this.serviceSID)
            .notifications.create({
                toBinding: notificationOptions.toBinding,
                body: notificationOptions.body,
            });
    }
}
