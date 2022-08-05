import { INotificationClient } from "../def/INotificationClient";
import { NotificationKind } from "../def/NotificationKind";

export class MockNotificationClient implements INotificationClient {
    send(to: string[], body: string): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    SendVerification(to: string, channel: NotificationKind): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    Verify(to: string, code: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}