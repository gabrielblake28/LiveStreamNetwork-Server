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
    created_for_test: boolean;
    aws_image_key: string;
    image_buffer?: Buffer;
}
