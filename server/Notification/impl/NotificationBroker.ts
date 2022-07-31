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
    Initialize(): Promise<void> {
        return new Promise(() => {
            let timeout: NodeJS.Timeout = setTimeout(() => {
                this.QueueNotification(new Date());
                setInterval(() => {
                    this.QueueNotification(new Date());
                    clearTimeout(timeout);
                }, 15 * 60 * 1000);
            }, this.getInitialNotificationDate(new Date()).getTime() - new Date().getTime());
        });
    }

    async QueueNotification(date: Date): Promise<void> {
        ///Get Upcoming Events (within 15 minutes);
        date.setMinutes(date.getMinutes(), 0, 0);
        const events = await this.EventService.GetEventsAtStartTime(
            10000,
            0,
            this.getDateIn(new Date(date), 15 * 60 * 1000)
        );
        if (events.result == "success") {
            events.data.forEach(async (event) => {
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

                if (emails.length > 0) {
                    this.NotificationFactory.CreateNotificationWorker({
                        Kind: "email",
                        body: `Send email for ${event.event_id}`,
                        to: emails,
                    }).send();
                }

                if (numbers.length > 0) {
                    this.NotificationFactory.CreateNotificationWorker({
                        Kind: "sms",
                        body: `Send text for ${event.event_id}`,
                        to: numbers,
                    }).send();
                }
            });
        }
    }

    private getDateIn(date: Date, minutes: number): Date {
        date.setTime(date.getTime() + minutes);
        return new Date(date);
    }

    private getInitialNotificationDate(date: Date): Date {
        const initialDate = new Date(date);

        if ([0, 15, 30, 45].includes(date.getMinutes())) {
            return date;
        }

        if (date.getMinutes() < 15) {
            initialDate.setMinutes(15, 0, 0);
        } else if (date.getMinutes() < 30) {
            initialDate.setMinutes(30, 0, 0);
        } else if (date.getMinutes() < 45) {
            initialDate.setMinutes(45, 0, 0);
        } else {
            initialDate.setMinutes(60, 0, 0);
        }

        return initialDate;
    }
}

///WORKERS GET SUBSCRIPTIONS, CREATE STRATEGIES, SEND EVENTS
