import { IEvent } from "../../Event/def/IEvent";
import { ISubscription } from "../../Subscriptions/def/ISubscription";

export interface INotificationService {
    GetEndedEvents(timestamp: string): IEvent[];

    GetActiveEvents(timestamp: string): IEvent[];

    BatchSendNotification(subscriptions: ISubscription[]): void;
}
