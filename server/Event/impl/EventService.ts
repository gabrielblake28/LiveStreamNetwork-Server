import { Helpers } from "../../common/Helpers";
import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { query } from "../../common/PostgresQuery";
import { IEvent } from "../def/IEvent";
import { IEventService } from "../def/IEventService";
import awsSDK from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

export class EventService implements IEventService {
    private readonly s3: awsSDK.S3;
    constructor() {
        awsSDK.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        });

        this.s3 = new awsSDK.S3();
    }
    async GetEventsAtStartTime(
        limit: number,
        page: number,
        date: Date | undefined = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT event_id from "Events" WHERE start_timestamp = $1 LIMIT $2 OFFSET $3`;

            const { rows } = await query(sql, [date, limit, page]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetLiveEvents(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT e.*, u.subscription_id FROM "EventView" e LEFT OUTER JOIN (SELECT subscription_id, event_id FROM "Subscriptions" WHERE user_id = $1) u ON e.event_id = u.event_id WHERE start_timestamp <= $2 and end_timestamp >= $2 LIMIT $3 OFFSET $4`;

            const { rows } = await query(sql, [
                user_id,
                date,
                limit,
                page * limit,
            ]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetFeaturedEvents(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT e.*, u.subscription_id FROM "EventView" e LEFT OUTER JOIN (SELECT subscription_id, event_id FROM "Subscriptions" WHERE user_id = $5) u ON e.event_id = u.event_id WHERE start_timestamp >= $1 AND start_timestamp <= $2 ORDER BY sub_count DESC LIMIT $3 OFFSET $4`;

            const dateInSevenDays = new Date(date);
            dateInSevenDays.setDate(date.getDate() + 7);
            console.log(dateInSevenDays.toLocaleDateString());
            const { rows } = await query(sql, [
                date,
                dateInSevenDays,
                limit,
                page * limit,
                user_id,
            ]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetTrendingEvents(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT e.*, u.subscription_id FROM "TrendingEvents" e LEFT OUTER JOIN (SELECT subscription_id, event_id FROM "Subscriptions" WHERE user_id = $3) u ON e.event_id = u.event_id ORDER BY sub_count DESC LIMIT $1 OFFSET $2`;

            const yesterday = new Date(date);
            yesterday.setDate(yesterday.getDate() - 1);
            console.log(yesterday);
            const { rows } = await query(sql, [limit, page * limit, user_id]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetSponsoredEvents(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT * FROM "Events" WHERE sponsored = true and start_timestamp >= $1 ORDER BY start_timestamp ASC LIMIT $2 OFFSET $3`;

            const { rows } = await query(sql, [date, limit, page * limit]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetEventsByUserId(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT * FROM "EventView" WHERE user_id = $1 and start_timestamp >= $2 LIMIT $3 OFFSET $4`;

            const { rows } = await query(sql, [
                user_id,
                date,
                limit,
                page * limit,
            ]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetUpcomingEvents(
        limit: number,
        page: number,
        user_id: string,
        date: Date = new Date()
    ): Promise<ResponsePayload<IEvent[]>> {
        try {
            const sql = `SELECT e.*, u.subscription_id FROM "EventView" e LEFT OUTER JOIN (SELECT subscription_id, event_id FROM "Subscriptions" WHERE user_id = $4) u ON e.event_id = u.event_id WHERE start_timestamp >= $1 ORDER BY start_timestamp ASC LIMIT $2 OFFSET $3`;

            const { rows } = await query(sql, [
                date,
                limit,
                page * limit,
                user_id,
            ]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async CreateEvent(resource: IEvent): Promise<ResponsePayload<string>> {
        try {
            const sql = `INSERT INTO "Events" (title, description, image, featured, user_id, start_timestamp, end_timestamp, created_for_test, aws_image_key) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING event_id`;

            const { rows } = await query(sql, [
                resource.title,
                resource.description,
                resource.image,
                resource.featured,
                resource.user_id,
                resource.start_timestamp,
                resource.end_timestamp,
                process.env.NODE_ENV == "test" ? true : false,
                resource.aws_image_key,
            ]);

            return sendSuccess(201, rows[0].event_id);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetEvent(
        event_id: string,
        user_id: string
    ): Promise<ResponsePayload<IEvent>> {
        try {
            const sql = `SELECT e.*, u.subscription_id FROM "EventView" e LEFT OUTER JOIN (SELECT subscription_id, event_id FROM "Subscriptions" WHERE user_id = $2) u ON e.event_id = u.event_id WHERE e.event_id = $1`;

            const { rows } = await query(sql, [event_id, user_id]);

            return sendSuccess(200, rows[0]);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async DeleteEvent(id: string): Promise<ResponsePayload<string>> {
        try {
            const sql = `DELETE FROM "Events" WHERE event_id = $1`;
            const event = await this.GetEvent(id, "0");

            if (event.result == "error") {
                return sendFailure(404, "event does not exist with id: " + id);
            } else {
                if (event.data.aws_image_key) {
                    await this.s3
                        .deleteObject({
                            Bucket: "" + process.env.S3_BUCKET_NAME,
                            Key: event.data.aws_image_key,
                        })
                        .promise();
                }
            }

            await query(sql, [id]);

            return sendSuccess(204, `Event ${id} successfully deleted`);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async UpdateEvent(
        id: string,
        resource: IEvent
    ): Promise<ResponsePayload<IEvent>> {
        try {
            const sql = `UPDATE "Events" SET title=$2, description=$3, image=$4, featured=$5, user_id=$6, start_timestamp=$7, end_timestamp=$8, aws_image_key=$9 WHERE event_id = $1 RETURNING *`;

            if (!resource.event_id) {
                return sendFailure(400, "Event Id cannot be undefined");
            }

            let aws_image_key: string;
            if (!resource.aws_image_key) {
                const event = await this.GetEvent(
                    resource.event_id!,
                    resource.user_id
                );

                if (event.result == "success") {
                    aws_image_key = event.data.aws_image_key;
                }
            } else {
                aws_image_key = resource.aws_image_key;
            }

            const response = await this.s3
                .upload({
                    Bucket: "" + process.env.S3_BUCKET_NAME,
                    Key: (aws_image_key ??= uuidv4()),
                    Body: resource.image_buffer,
                    ContentType: "image/jpeg",
                })
                .promise();

            const { rows } = await query(sql, [
                id,
                resource.title,
                resource.description,
                response.Location,
                resource.featured,
                resource.user_id,
                resource.start_timestamp,
                resource.end_timestamp,
                response.Key,
            ]);

            return sendSuccess(200, rows[0]);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async GetSubscribedEvents(
        user_id: string,
        start_timestamp: Date = new Date()
    ): Promise<ResponsePayload<Partial<IEvent>[]>> {
        try {
            const sql = `Select * from "SubscriptionsView" where user_id = $1 and end_timestamp >= $2 order by start_timestamp DESC`;

            const { rows } = await query(sql, [user_id, start_timestamp]);

            return sendSuccess(200, rows);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }

    async DeleteTestEvents(user_id: string): Promise<ResponsePayload<string>> {
        try {
            if (process.env.NODE_ENV != "test") {
                return sendFailure(
                    400,
                    "This method is only available in a test environment"
                );
            }
            const sql = `DELETE FROM "Events" WHERE user_id = $1 and created_for_test = true`;

            await query(sql, [user_id]);
            return sendSuccess(204, `Event ${user_id} successfully deleted`);
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }
}
