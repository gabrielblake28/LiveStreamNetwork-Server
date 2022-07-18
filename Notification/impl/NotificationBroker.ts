import { IEvent } from "../../Event/def/IEvent";
import { IEventService } from "../../Event/def/IEventService";
import { ISubscriptionService } from "../../Subscriptions/def/ISubscriptionService";
import { INotificationBroker } from "../def/INotificationBroker";
import worker from "node:worker_threads";
import { INotificationFactory } from "../def/INotificationFactory";
import { NotificationFactory } from "./NotificationFactory";

export class NotificationBroker implements INotificationBroker {
    private EventService: IEventService;
    private SubscriptionService: ISubscriptionService;
    private NotificationFactory: INotificationFactory;

    constructor(
        eventService: IEventService,
        subscriptionService: ISubscriptionService,
        notificationFactory: INotificationFactory = new NotificationFactory()
    ) {
        this.EventService = eventService;
        this.SubscriptionService = subscriptionService;
        this.NotificationFactory = notificationFactory;
    }

    async QueueNotification(date: Date): Promise<void> {
        ///Get Upcoming Events (within 15 minutes);
        const events = await this.EventService.GetEventsAtStartTime(
            10000,
            0,
            this.getDateIn(date, 15 * 60 * 1000)
        );

        events.forEach(async (event) => {
            const subscriptions =
                await this.SubscriptionService.BatchGetSubscriptions(
                    event.event_id!
                );

            const emails: string[] = [];
            const numbers: string[] = [];

            subscriptions.forEach((subscription) => {
                if (subscription.allow_email) {
                    emails.push(subscription.email);
                }

                if (subscription.allow_sms) {
                    numbers.push(subscription.phone);
                }
            });

            if (emails.length <= 0) {
                this.NotificationFactory.CreateNotificationWorker({
                    Kind: "email",
                    body: `Send email for ${event.event_id}`,
                    to: emails,
                }).send();
            }

            if (numbers.length <= 0) {
                this.NotificationFactory.CreateNotificationWorker({
                    Kind: "sms",
                    body: `Send text for ${event.event_id}`,
                    to: numbers,
                }).send();
            }
        });
    }

    private getDateIn(date: Date, minutes: number): Date {
        date.setTime(date.getTime() + minutes);
        return new Date(date);
    }
}

///WORKERS GET SUBSCRIPTIONS, CREATE STRATEGIES, SEND EVENTS
