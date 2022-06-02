import { query } from "../../common/PostgresQuery";
import { ITwitchUser } from "../def/ITwitchUser";
import { ITwitchUserService } from "../def/ITwitchUserService";

export class TwitchUserService implements ITwitchUserService {
    async CreateUser(resource: ITwitchUser): Promise<string> {
        const sql = `INSERT INTO "Users" (user_id, twitch_id, display_name, description, profile_image_url, view_count, email, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id`;

        const { rows } = await query(sql, [
            resource.user_id,
            resource.twitch_id,
            resource.display_name,
            resource.description,
            resource.profile_image_url,
            resource.view_count,
            resource.email,
            resource.date_created,
        ]);

        return rows[0].user_id;
    }

    async UpdateUser(id: string, resource: ITwitchUser): Promise<ITwitchUser> {
        throw new Error("Method not implemented.");
    }
    async GetUser(id: string): Promise<ITwitchUser> {
        throw new Error("Method not implemented.");
    }
    async DeleteUser(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async GetUserByTwitchId(twitch_id: string): Promise<ITwitchUser> {
        const sql = `SELECT * FROM "Users" WHERE twitch_id = $1`;

        const { rows } = await query(sql, [twitch_id]);

        return rows[0];
    }
}
