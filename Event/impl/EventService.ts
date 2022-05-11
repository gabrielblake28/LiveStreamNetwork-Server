import { Helpers } from "../../common/Helpers";
import { query } from "../../common/PostgresQuery";
import { IEvent } from "../def/IEvent";
import { IEventService } from "../def/IEventService";

export class EventService implements IEventService {
    async GetLiveEvents(
        limit: number,
        page: number,
        date: Date = new Date()
    ): Promise<IEvent[]> {
        const sql = `SELECT * FROM "Events" WHERE start_timestamp <= $1 and end_timestamp >= $1 LIMIT $2 OFFSET $3`;

        const { rows } = await query(sql, [date, limit, page * limit]);

        return rows;
    }

    async GetFeaturedEvents(
        limit: number,
        page: number,
        date: Date = new Date()
    ): Promise<IEvent[]> {
        const sql = `SELECT * FROM "Events" WHERE featured = true and start_timestamp >= $1 ORDER BY start_timestamp ASC LIMIT $2 OFFSET $3`;

        const { rows } = await query(sql, [date, limit, page * limit]);

        return rows;
    }

    async GetEventsWithMatchingUserIds(
        limit: number,
        page: number,
        userIds: string[]
    ): Promise<IEvent[]> {
        const sql = `SELECT * FROM "Events" WHERE user_id in(${Helpers.formatStringFromArray(
            userIds
        )}) LIMIT $1 OFFSET $2`;

        const { rows } = await query(sql, [limit, page * limit]);

        return rows;
    }

    async GetUpcomingEvents(
        limit: number,
        page: number,
        date: Date = new Date()
    ): Promise<IEvent[]> {
        const sql = `SELECT * FROM "Events" WHERE start_timestamp >= $1 ORDER BY start_timestamp ASC LIMIT $2 OFFSET $3 `;

        const { rows } = await query(sql, [date, limit, page * limit]);

        return rows;
    }

    async GetEventsByTwitchCategory(
        category_id: string,
        limit: number,
        page: number,
        date: Date
    ): Promise<IEvent[]> {
        const sql = `SELECT * FROM "Events" WHERE category_id = $1 AND start_timestamp >= $4 ORDER BY start_timestamp ASC LIMIT $2 OFFSET $3`;

        const { rows } = await query(sql, [
            category_id,
            limit,
            page * limit,
            date,
        ]);

        return rows;
    }

    async CreateEvent(resource: IEvent): Promise<string> {
        const sql = `INSERT INTO "Events" (title, description, image, featured, category_id, user_id, start_timestamp, end_timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id`;

        const { rows } = await query(sql, [
            resource.title,
            resource.description,
            resource.image,
            resource.featured,
            resource.category_id,
            resource.user_id,
            resource.start_timestamp,
            resource.end_timestamp,
        ]);

        return rows[0].event_id;
    }

    async GetEvent(id: string): Promise<IEvent> {
        const sql = `SELECT * FROM "Events" WHERE event_id = $1`;

        const { rows } = await query(sql, [id]);

        return rows[0];
    }

    async DeleteEvent(id: string): Promise<void> {
        const sql = `DELETE FROM "Events" WHERE event_id = $1`;

        await query(sql, [id]);
    }

    async UpdateEvent(id: string, resource: IEvent): Promise<IEvent> {
        const sql = `UPDATE "Events" SET title=$2, description=$3, image=$4, featured=$5, category_id=$6, user_id=$7, start_timestamp=$8, end_timestamp=$9 WHERE event_id = $1 RETURNING *`;

        const { rows } = await query(sql, [
            id,
            resource.title,
            resource.description,
            resource.image,
            resource.featured,
            resource.category_id,
            resource.user_id,
            resource.start_timestamp,
            resource.end_timestamp,
        ]);

        return rows[0];
    }

    async SubscribeToEvent(user_id: string, event_id: string): Promise<string> {
        const sql = `INSERT INTO "Subscriptions" (user_id, event_id) VALUES ($1, $2) RETURNING subscription_id`;

        const { rows } = await query(sql, [user_id, event_id]);

        return rows[0].subscription_id;
    }

    async UnsubscribeToEvent(subscription_id: string): Promise<void> {
        const sql = `DELETE FROM "Subscriptions" WHERE subscription_id = $1`;

        await query(sql, [subscription_id]);
    }

    async IsSubscribedToEvent(
        user_id: string,
        event_id: string
    ): Promise<boolean> {
        const sql = `SELECT * FROM "Subscriptions" WHERE user_id = $1 AND event_id = $2`;

        const { rows } = await query(sql, [user_id, event_id]);

        if (rows[0]) {
            return true;
        } else {
            return false;
        }
    }
}
