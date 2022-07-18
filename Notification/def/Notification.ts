import { NotificationKind } from "./NotificationKind";

export interface INotification {
    Kind: NotificationKind;
    body: string;
    to: string[];
}
