import { NotificationKind } from "./NotificationKind";

export interface INotificationClient {
    send(to: string[], body: string): Promise<boolean>;

    SendVerification(to: string, channel: NotificationKind): Promise<boolean>;

    Verify(to: string, code: string): Promise<boolean>;
}
