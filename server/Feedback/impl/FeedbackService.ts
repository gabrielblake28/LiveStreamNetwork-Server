import { IFeedback } from "../def/Ifeedback";
import { IFeedbackService } from "../def/IFeedbackService";
import { query } from "../../common/PostgresQuery";

export class FeedbackService implements IFeedbackService {
    async CreateFeedback(resource: IFeedback): Promise<string> {
        const sql = `INSERT INTO "Feedback" (user_id, feedback) VALUES ($1, $2) RETURNING feedback_id`;

        const { rows } = await query(sql, [
            resource.user_id,
            resource.feedback,
        ]);

        return rows[0].feedback_id;
    }
}
