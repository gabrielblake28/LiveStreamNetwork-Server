export interface IUser {
    user_id: number;  // user_id is a string on IEvent   
    created_date: Date;
    username: string;
    password: string;
    email: string;
    phone?: string;
    status?: string;
    twitch_info?: string;
}
