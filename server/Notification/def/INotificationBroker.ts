export interface INotificationBroker {
    QueueNotification(date: Date): Promise<void>;
}
