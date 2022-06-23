export interface INotificationClient {
    create(notificationOptions: { toBinding: string[]; body: string }): void;
}
