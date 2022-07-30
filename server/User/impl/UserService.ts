import { query } from "../../common/PostgresQuery";
import { IUser } from "../def/IUser";
import { IUserService } from "../def/IUserService";
import { ITwitchUserData } from "../def/ITwitchUserData";

export class UserService implements IUserService {
    async CreateUser(resource: IUser): Promise<IUser> {
        const sql = `INSERT INTO "Users" (twitch_id, display_name, description, profile_image_url, view_count, email, phone, created_at, offline_image_url, broadcaster_type, type, created_at_source) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;

        const { rows } = await query(sql, [
            resource.twitch_id,
            resource.display_name,
            resource.description,
            resource.profile_image_url,
            resource.view_count,
            resource.email,
            resource.phone,
            resource.created_at,
            resource.offline_image_url,
            resource.broadcaster_type,
            resource.type,
            resource.created_at_source,
        ]);

        return rows[0].user_id;
    }

    async GetUser(id: string): Promise<IUser> {
        const sql = `SELECT * FROM "Users" WHERE user_id = $1`;

        const { rows } = await query(sql, [id]);

        return rows[0];
    }

    async UpdateUser(id: string, resource: IUser): Promise<IUser> {
        const sql = `UPDATE "Users" SET username=$2, password=$3, email=$4, status=$5, twitch_info=$6`;

        const { rows } = await query(sql, [
            id,
            resource.display_name,
            resource.description,
            resource.profile_image_url,
            resource.email,
            resource.phone,
        ]);

        return rows[0];
    }

    async DeleteUser(id: string): Promise<void> {
        const sql = `DELETE FROM "Users" WHERE user_id = $1`;

        await query(sql, [id]);
    }

    async GetUserByUsername(username: string): Promise<IUser> {
        const sql = `SELECT * FROM "Users" WHERE username = $1`;
        const { rows } = await query(sql, []);
        return rows;
    }

    async GetOrCreateUser(resource: ITwitchUserData): Promise<IUser> {
        const sql = `SELECT * FROM "Users" WHERE twitch_id = $1`;
        const { rows } = await query(sql, [resource.id]);

        if (!rows[0]) {
            return await this.CreateUser({
                twitch_id: resource.id,
                display_name: resource.display_name,
                description: resource.description,
                profile_image_url: resource.profile_image_url,
                view_count: resource.view_count,
                email: resource.email,
                created_at: new Date(),
                offline_image_url: resource.offline_image_url,
                broadcaster_type: resource.broadcaster_type,
                type: resource.type,
                login: resource.login,
                allow_email: true,
                allow_sms: true,
                created_at_source: resource.created_at,
            });
        }
        return rows[0];
    }
}
