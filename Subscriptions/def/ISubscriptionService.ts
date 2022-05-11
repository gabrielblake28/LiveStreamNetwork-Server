import { IEvent } from "../../Event/def/IEvent";
import { ISubscription } from "./ISubscription";

export interface ISubscriptionService {
    BatchGetSubscriptions(eventIds: string[]): Promise<ISubscription[]>;

    BatchClearSubscriptions(eventIds: string[]): void;
}
