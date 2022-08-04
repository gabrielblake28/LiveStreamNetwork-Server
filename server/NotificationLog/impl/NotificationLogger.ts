import { query } from "../../common/PostgresQuery";
import { INotificationLogger } from "../def/INotificationLogger";
import { NotificationLog } from "../def/NotificationLog";

export class NotificationLogger implements INotificationLogger {
    async LogNotification(log: NotificationLog): Promise<boolean> {
        const sql = `INSERT INTO "NotificationLog"(sent_to, sent_count, body, timestamp) VALUES ($1, $2, $3, $4)`;

        await query(sql, [
            log.sent_to,
            log.sent_count,
            log.body,
            log.timestamp,
        ]);

        return true;
    }
}
