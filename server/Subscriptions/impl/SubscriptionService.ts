import { Helpers } from "../../common/Helpers";
import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { query } from "../../common/PostgresQuery";
import { ISubscription } from "../def/ISubscription";
import { ISubscriptionService } from "../def/ISubscriptionService";

export class SubscriptionService implements ISubscriptionService {
    async GetSubscriptionByEvent(
        event_id: string,
        user_id: string
    ): Promise<ResponsePayload<ISubscription>> {
        try {
            const sql = `SELECT * FROM "Subscriptions" WHERE event_id = $1 and user_id = $2`;

            const { rows } = await query(sql, [event_id, user_id]);

            if (rows[0]) {
                return sendSuccess<ISubscription>(200, rows[0]);
            } else {
                return sendFailure(
                    404,
                    `No subscription found for event: ${event_id}`
                );
            }
        } catch (e: any) {
            return sendFailure(500, (e as Error).message);
        }
    }
    async AddSubscription(
        resource: Partial<ISubscription>
    ): Promise<ResponsePayload<string>> {
        try {
            const sql = `INSERT INTO "Subscriptions" (event_id, user_id, created_date) VALUES ($1, $2, $3) RETURNING subscription_id`;

            const { rows } = await query(sql, [
                resource.event_id,
                resource.user_id,
                resource.created_date,
            ]);

            return sendSuccess(201, rows[0].subscription_id);
        } catch (e: any) {
            return sendFailure(500, (e as Error).message);
        }
    }
    async RemoveSubscription(
        subscription_id: string
    ): Promise<ResponsePayload<string>> {
        try {
            const sql = `DELETE from "Subscriptions" WHERE subscription_id=$1`;

            await query(sql, [subscription_id]);

            return sendSuccess(200, "Successfully deleted subscription");
        } catch (e: any) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetSubscription(
        subscription_id: string
    ): Promise<ResponsePayload<ISubscription>> {
        try {
            const sql = `SELECT * FROM "Subscriptions" WHERE subscription_id=$1`;

            const { rows } = await query(sql, [subscription_id]);

            if (rows[0]) {
                return sendSuccess(200, rows[0]);
            } else {
                return sendFailure(
                    404,
                    `Subscription not found with id: ${subscription_id}`
                );
            }
        } catch (e: any) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async BatchGetSubscriptions(event_id: string): Promise<ISubscription[]> {
        const sql = `SELECT * FROM "SubscriptionsView" WHERE event_id = $1`;

        const { rows }: { rows: ISubscription[] } = await query(sql, [
            event_id,
        ]);

        return rows;
    }

    async BatchClearSubscriptions(eventIds: string[]): Promise<void> {
        const sql = `delete from "Subscriptions" WHERE event_id in (${Helpers.formatStringFromArray(
            eventIds
        )})`;

        await query(sql, []);
    }
}
