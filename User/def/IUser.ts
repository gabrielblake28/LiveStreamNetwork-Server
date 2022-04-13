export interface IUser {
    user_id: number;
    created_date: Date;
    username: string;
    password: string;
    email: string;
    phone?: string;
    status?: string;
    twitch_info?: string;
}
