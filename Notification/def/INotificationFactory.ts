import { INotificationStrategy } from "./INotificationStrategy";
import { INotification } from "./Notification";
import { NotificationKind } from "./NotificationKind";

export interface INotificationFactory {
    CreateNotificationWorker(
        notification: INotification
    ): INotificationStrategy;
}
