export interface IEvent {
    title: string;
    description: string;
    start_timestamp: Date;
    end_timestamp: Date;
    image?: string;
    featured: boolean;
    user_id: string;
    event_id?: string;
    profile_image_url?: string;
    display_name?: string;
    email?: string;
    subscription_id?: string;
}
