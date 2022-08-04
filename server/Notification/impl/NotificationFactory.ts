import { INotificationFactory } from "../def/INotificationFactory";
import { INotificationStrategy } from "../def/INotificationStrategy";
import { INotification } from "../def/Notification";
import { NotificationKind } from "../def/NotificationKind";
import { BatchEmailNotificationStrategy } from "./BatchEmailNotificationStrategy";
import { BatchTextNotificationStrategy } from "./BatchTextNotificationStrategy";
import { MockNotificationClient } from "./MockNotificationClient";
import { TwilioClientWrapper } from "./TwilioClientWrapper";

export class NotificationFactory implements INotificationFactory {
    CreateNotificationWorker(
        notification: INotification
    ): INotificationStrategy {
        if (notification.Kind == "email") {
            return new BatchTextNotificationStrategy(
                notification,
                new MockNotificationClient()
            );
        }

        if (notification.Kind == "sms") {
            return new BatchTextNotificationStrategy(
                notification,
                new MockNotificationClient()
            );
        }

        throw new Error("Notification kind not supported");
    }
}
