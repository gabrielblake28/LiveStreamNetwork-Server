import { Helpers } from "../../common/Helpers";
import { query } from "../../common/PostgresQuery";
import { ISubscription } from "../def/ISubscription";
import { ISubscriptionService } from "../def/ISubscriptionService";

export class SubscriptionService implements ISubscriptionService {
    async BatchGetSubscriptions(eventIds: string[]): Promise<ISubscription[]> {
        const sql = `SELECT * FROM "SubscriptionsView" WHERE event_id in(${Helpers.formatStringFromArray(
            eventIds
        )})`;

        const { rows }: { rows: ISubscription[] } = await query(sql, []);

        return rows;
    }

    async BatchClearSubscriptions(eventIds: string[]): Promise<void> {
        const sql = `delete from "Subscriptions" WHERE event_id in (${Helpers.formatStringFromArray(
            eventIds
        )})`;

        await query(sql, []);
    }
}
