import { IEvent } from "../../Event/def/IEvent";
import { ISubscription } from "./ISubscription";

export interface ISubscriptionService {
    BatchGetSubscriptions(eventIds: string[]): Promise<ISubscription[]>;

    BatchClearSubscriptions(eventIds: string[]): void;

    addSubscription(resource: ISubscription): Promise<string>;

    removeSubscription(subscription_id: string): Promise<void>;

    getSubscription(subscription_id: string): Promise<ISubscription>;
}
