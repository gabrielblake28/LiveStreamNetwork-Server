import { INotificationClient } from "../def/INotificationClient";

export class MockNotificationClient implements INotificationClient {
    create(notificationOptions: { toBinding: string[]; body: string }): void {
        console.log(
            `Mock response ${notificationOptions.body} was sent to ${notificationOptions.toBinding}`
        );
    }
}
