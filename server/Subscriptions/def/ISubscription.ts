export interface ISubscription {
    subscription_id: string;
    event_id: string;
    user_id: string;
    allow_email: boolean;
    allow_sms: boolean;
    phone: string;
    email: string;
    created_date: Date;
}
