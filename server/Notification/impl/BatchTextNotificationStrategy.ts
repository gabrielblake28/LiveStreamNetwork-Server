import { INotificationStrategy } from "../def/INotificationStrategy";
import { INotificationClient } from "../def/INotificationClient";
import { INotificationLogger } from "../../NotificationLog/def/INotificationLogger";
import { NotificationLogger } from "../../NotificationLog/impl/NotificationLogger";
import { INotification } from "../def/Notification";

export class BatchTextNotificationStrategy implements INotificationStrategy {
    private readonly Numbers: string[];
    private readonly Body: string;
    private readonly Client: INotificationClient;
    private readonly Logger: INotificationLogger;

    constructor(
        notification: INotification,
        client: INotificationClient,
        logger: INotificationLogger = new NotificationLogger()
    ) {
        this.Numbers = notification.to;
        this.Body = notification.body;
        this.Client = client;
        this.Logger = logger;
    }

    async send(): Promise<void> {
        if (process.env.TWILIO_NOTIFY_SID == null) {
            throw new Error("Twilio Notify SID cannot be null");
        }

        await this.Client.send(this.createBindings(), this.Body);

        this.Logger.LogNotification({
            body: this.Body,
            timestamp: new Date(),
            sent_to: this.Numbers,
            sent_count: this.Numbers.length,
        });
    }

    private createBindings(): string[] {
        return this.Numbers.map((number) => {
            return JSON.stringify({ binding_type: "sms", address: number });
        });
    }
}
