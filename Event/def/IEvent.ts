export interface IEvent {
    start_timestamp: Date;
    end_timestamp: Date;
    title: string;
    description?: string;
    image?: string;
    featured: boolean;
    user_id: string;
    category_id: string;
    event_id?: string;
    created_for_test: boolean;
}
