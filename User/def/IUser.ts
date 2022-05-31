export interface IUser {
    user_id?: string;
    twitch_id: string;
    display_name: string;
    description: string;
    profile_image_url: string;
    view_count: number;
    email: string;
    created_at: string;
    broadcaster_type: string;
    login: string;
    offline_image_url: string;
    type: string;
    phone?: string;
}
