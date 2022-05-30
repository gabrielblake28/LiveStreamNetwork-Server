export interface IUser {
    user_id: string;
    twitch_id: string;
    created_at: Date;
    display_name: string;
    email: string;
    phone?: string;
    status?: string;
    twitch_info?: string;
}
