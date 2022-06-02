import { INotificationStrategy } from "../def/INotificationStrategy";
import { INotificationClient } from "../def/INotificationClient";

export class BatchTextNotificationStrategy implements INotificationStrategy {
    private readonly bindings: string[];
    private readonly body: string;
    private readonly client: INotificationClient;

    constructor(numbers: string[], body: string, client: INotificationClient) {
        this.bindings = numbers.map((number) => {
            return JSON.stringify({ binding_type: "sms", address: number });
        });

        this.body = body;
        this.client = client;
    }

    async send(): Promise<void> {
        if (process.env.TWILIO_NOTIFY_SID == null) {
            throw new Error("Twilio Notify SID cannot be null");
        }

        const response = await this.client.create({
            toBinding: this.bindings,
            body: this.body,
        });
        console.log(response);
    }
}
