import { IEvent } from "../../Event/def/IEvent";
import { ISubscription } from "../../Subscriptions/def/ISubscription";
import { INotificationService } from "../def/INotificationService";

export class NotificationService implements INotificationService {
    GetEndedEvents(timestamp: string): IEvent[] {
        throw new Error("Method not implemented.");
    }
    GetActiveEvents(timestamp: string): IEvent[] {
        throw new Error("Method not implemented.");
    }
    BatchSendNotification(subscriptions: ISubscription[]): void {
        throw new Error("Method not implemented.");
    }
}
