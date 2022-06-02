import { Helpers } from "../../common/Helpers";
import { query } from "../../common/PostgresQuery";
import { ISubscription } from "../def/ISubscription";
import { ISubscriptionService } from "../def/ISubscriptionService";

export class SubscriptionService implements ISubscriptionService {
    async addSubscription(resource: ISubscription): Promise<string> {
        const sql = `INSERT INTO "Subscriptions" (event_id, user_id) VALUES ($1, $2) RETURNING subscription_id`;

        const { rows } = await query(sql, [
            resource.event_id,
            resource.user_id,
        ]);

        return rows;
    }
    async removeSubscription(subscription_id: string): Promise<void> {
        const sql = `DELETE from "Subscriptions" WHERE subscription_id=$1`;

        await query(sql, [subscription_id]);
    }

    async getSubscription(subscription_id: string): Promise<ISubscription> {
        const sql = `SELECT FROM "Subscriptions" WHERE subscription_id=$1`;

        const { rows } = await query(sql, [subscription_id]);

        return rows;
    }

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
