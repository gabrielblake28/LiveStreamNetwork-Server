import UserNames from "../data/users.json";
import EventNames from "../data/events.json";
import { IEvent } from "../../Event/def/IEvent";
import { query } from "../../common/PostgresQuery";
import { TriggerContext } from "twilio/lib/rest/api/v2010/account/usage/trigger";
import { IUser } from "../../User/def/IUser";
import { UserSearchProvider } from "../../Search/impl/UserSearchProvider";
import { ISubscription } from "../../Subscriptions/def/ISubscription";

export class TestService {
    constructor() {}

    async CreateEvents(
        count: number,
        endDate: Date = new Date(),
        assignUsers: boolean = false
    ) {
        if (count > 10000) {
            throw Error("Cannot create more than 10000 events");
        }

        const users: IUser[] = assignUsers ? await this.GetUsers(count) : [];

        const events: Partial<IEvent>[] = [];

        let sql = `INSERT INTO "Events"(title, description, image, start_timestamp, end_timestamp, user_id, created_for_test, featured) VALUES`;

        for (let i = 0; i < count; i++) {
            const eventName =
                EventNames[Math.ceil(Math.random() * EventNames.length - 1)];
            const date = this.GetRandomDate(new Date(), endDate);
            events.push({
                title: eventName,
                description: "",
                image: `https://picsum.photos/800/450?dummyParam=${i}`,
                start_timestamp: date,
                end_timestamp: this.SetHours(date, 3),
                created_for_test: true,
                featured: true,
                user_id: assignUsers
                    ? users[Math.ceil(Math.random() * users.length - 1)].user_id
                    : "1",
            });
        }
        events.forEach((event) => {
            sql += `('${event.title}', '${event.description}', 
            '${event.image}', '${event.start_timestamp?.toISOString()}', 
            '${event.end_timestamp?.toISOString()}', ${event.user_id},
            ${event.created_for_test}, ${event.featured}),`;
        });

        await query(sql.slice(0, sql.length - 1), []);
    }

    async DeleteEvents() {
        await query(`DELETE FROM "Events" WHERE created_for_test=true`, []);
    }

    async CreateUsers(count: number) {
        if (count > 10000) {
            throw Error("Cannot create more than 10000 events");
        }

        const users: Partial<IUser>[] = [];

        let sql = `INSERT INTO "Users"(display_name, twitch_id, profile_image_url, email, offline_image_url, created_for_test, allow_email, allow_sms, phone) VALUES`;

        const userName = UserNames.slice(0, count);

        for (let i = 0; i < userName.length; i++) {
            users.push({
                display_name: userName[i],
                twitch_id: Math.round(
                    i * Math.random() * 1000000000
                ).toString(),
                profile_image_url: `https://robohash.org/${i}.png`,
                email: `twefrontendtestemail@gmail.com`,
                offline_image_url: `https://robohash.org/${i}.png`,
                created_for_test: true,
                phone: "+8635129916",
                allow_email: true,
                allow_sms: true,
            });
        }

        users.forEach((user) => {
            sql += `('${user.display_name}', '${user.twitch_id}', '${user.profile_image_url}', '${user.email}', '${user.offline_image_url}', '${user.created_for_test}', '${user.allow_email}', '${user.allow_sms}', '${user.phone}'),`;
        });

        await query(sql.slice(0, sql.length - 1), []);
    }

    async DeleteUsers() {
        await query(`DELETE FROM "Users" WHERE created_for_test=true`, []);
    }

    async AddSubscriptions(eventsCount: number, maxSubscriptions: number) {
        if (eventsCount > 500) {
            throw Error("Cannot subscribe to more than 500 events at once");
        }

        if (maxSubscriptions > 1000) {
            throw Error("Cannot add more than 1000 subscriptions at once");
        }

        let sql = `INSERT INTO "Subscriptions"(event_id, user_id, created_date) VALUES`;

        const subscriptions: Partial<ISubscription>[] = [];
        const events = await this.GetEvents(eventsCount);
        const users = await this.GetUsers(maxSubscriptions);

        events.forEach((event) => {
            const subsToAdd = Math.random() * maxSubscriptions;
            for (let i = 0; i < subsToAdd; i++) {
                subscriptions.push({
                    event_id: event.event_id,
                    user_id: users[i].user_id,
                });
            }
        });

        subscriptions.forEach((subscription) => {
            sql += `('${subscription.event_id}', '${
                subscription.user_id
            }', '${new Date().toISOString()}'),`;
        });

        await query(sql.slice(0, sql.length - 1), []);
    }

    async DeleteSubscriptions() {
        await query(
            `DELETE FROM "Subscriptions" WHERE created_for_test=true`,
            []
        );
    }

    CreateScenario(dateRange: number, count: number) {}
    DeleteScenario() {}

    private async GetUsers(count?: number): Promise<IUser[]> {
        const { rows } = await query(
            `SELECT * FROM "Users" where created_for_test=true LIMIT $1`,
            [count]
        );

        return rows;
    }

    private async GetEvents(count?: number): Promise<IEvent[]> {
        const { rows } = await query(
            `SELECT * FROM "Events" where created_for_test=true LIMIT $1`,
            [count]
        );

        return rows;
    }

    private GetRandomDate(from: Date, to: Date): Date {
        const fromTime = from.getTime();
        const toTime = to.getTime();

        //Get Random Date between from and to
        const date = new Date(fromTime + Math.random() * (toTime - fromTime));

        date.setHours(
            Math.random() * 23,
            Math.round(Math.random() * 4) * 15,
            0,
            0
        );
        return date;
    }

    private SetHours(date: Date, offset: number): Date {
        const newDate = new Date(date);

        newDate.setHours(
            newDate.getHours() + offset,
            newDate.getMinutes(),
            newDate.getSeconds(),
            newDate.getMilliseconds()
        );

        return newDate;
    }
}
