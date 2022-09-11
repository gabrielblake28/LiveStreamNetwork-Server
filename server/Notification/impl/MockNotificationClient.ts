import { INotificationClient } from "../def/INotificationClient";
import { NotificationKind } from "../def/NotificationKind";

export class MockNotificationClient implements INotificationClient {
    send(to: string[], body: string): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    SendVerification(to: string, channel: NotificationKind): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(true);
        });
    }

    Verify(to: string, code: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (code == "123456") {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}
