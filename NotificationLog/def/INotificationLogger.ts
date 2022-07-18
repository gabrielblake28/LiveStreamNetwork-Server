import { NotificationLog } from "./NotificationLog";

export interface INotificationLogger {
    LogNotification(log: NotificationLog): Promise<boolean>;
}
