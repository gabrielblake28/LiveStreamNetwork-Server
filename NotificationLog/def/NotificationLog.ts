export interface NotificationLog {
    log_id?: string;
    sent_to: string[];
    sent_count: number;
    body: string;
    timestamp: Date;
}
