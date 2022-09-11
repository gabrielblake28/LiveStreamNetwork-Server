import twilio from "twilio";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import { INotificationClient } from "../def/INotificationClient";
import { NotificationKind } from "../def/NotificationKind";

export class TwilioClientWrapper implements INotificationClient {
    client: twilio.Twilio;
    serviceSID: string;

    constructor(accountSID: string, serviceSID: string, authToken: string) {
        this.client = twilio(accountSID, authToken);

        this.serviceSID = serviceSID;
    }
    async SendVerification(
        to: string,
        channel: NotificationKind
    ): Promise<boolean> {
        return await this.client.verify.v2
            .services("VA9f33644caadc5b23478ee4d2a79b386a")
            .verifications.create({ to, channel: channel })
            .then((response) => true)
            .catch((error) => {
                console.log(error);
                return false;
            });
    }
    async Verify(to: string, code: string): Promise<boolean> {
        return await this.client.verify.v2
            .services("VA9f33644caadc5b23478ee4d2a79b386a")
            .verificationChecks.create({ to, code })
            .then((response) => response.valid)
            .catch((error) => {
                console.log(error);
                return false;
            });
    }
    async send(to: string[], body: string): Promise<boolean> {
        return await this.client.notify
            .services(this.serviceSID)
            .notifications.create({
                toBinding: to,
                body: body,
            })
            .then(() => true)
            .catch(() => false);
    }
}
