import { query } from "../../common/PostgresQuery";
import { IUser } from "../def/IUser";
import { IUserService } from "../def/IUserService";
import bcrypt from "bcrypt";

const saltRounds = 10;
const jwt = require("jsonwebtoken");

export class UserService implements IUserService {
    async CreateUser(resource: IUser): Promise<string> {
        const sql = `INSERT INTO "Users" (username, password) VALUES ($1, $2) RETURNING user_id`;

        const salt = bcrypt.genSaltSync(saltRounds);
        const bcryptHash = await bcrypt.hashSync(resource.password, salt);

        const { rows } = await query(sql, [
            resource.username.toLocaleLowerCase(),
            bcryptHash,
            // resource.email,
            // resource.status,
            // resource.twitch_info,
            // resource.user_id,
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
            resource.username,
            resource.password,
            resource.email,
            resource.phone,
            resource.status,
            resource.twitch_info,
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

    async AuthenticateUser(username: string, password: string): Promise<IUser> {
        const user: IUser = await this.GetUserByUsername(
            username.toLocaleLowerCase()
        );
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("username or password does not match");
        }
        if (!process.env.SECRET) {
            throw new Error("Server error. contact administrator");
        }
        return jwt.sign(user.user_id, process.env.SECRET);
    }
}
