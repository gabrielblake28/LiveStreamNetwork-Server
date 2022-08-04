import { ResponsePayload } from "../../common/message/MessageService";
import { IEvent } from "../../Event/def/IEvent";
import { ISubscription } from "./ISubscription";

export interface ISubscriptionService {
    BatchGetSubscriptions(event_id: string): Promise<ISubscription[]>;

    BatchClearSubscriptions(eventIds: string[]): void;

    AddSubscription(
        resource: Partial<ISubscription>
    ): Promise<ResponsePayload<string>>;

    RemoveSubscription(
        subscription_id: string
    ): Promise<ResponsePayload<string>>;

    GetSubscription(
        subscription_id: string
    ): Promise<ResponsePayload<ISubscription>>;

    GetSubscriptionByEvent(
        event_id: string,
        user_id: string
    ): Promise<ResponsePayload<ISubscription>>;
}
