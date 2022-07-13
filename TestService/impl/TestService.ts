import UserNames from "../data/users.json";
import EventNames from "../data/events.json";
import { IEvent } from "../../Event/def/IEvent";
import { query } from "../../common/PostgresQuery";
import { TriggerContext } from "twilio/lib/rest/api/v2010/account/usage/trigger";

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

        const events: Partial<IEvent>[] = [];

        let sql = `INSERT INTO "Events"(title, description, image, start_timestamp, end_timestamp, ${
            assignUsers ? "user_id," : ""
        }created_for_test, featured) VALUES`;

        const eventNames = EventNames.slice(0, count);

        for (let i = 0; i < count; i++) {
            const eventName =
                EventNames[Math.ceil(Math.random() * EventNames.length - 1)];
            const date = this.GetRandomDate(new Date(), new Date("2023-08-12"));
            events.push({
                title: eventName,
                description: "",
                image: `https://picsum.photos/800/450?dummyParam=${i}`,
                start_timestamp: date,
                end_timestamp: date,
                user_id: "1",
                created_for_test: true,
                featured: true,
            });
        }
        events.forEach((event) => {
            sql += `('${event.title}', '${event.description}', '${
                event.image
            }', '${event.start_timestamp?.toISOString()}', '${event.end_timestamp?.toISOString()}', ${"1"}, ${
                event.created_for_test
            }, ${event.featured}),`;
        });

        console.log(sql.slice(0, sql.length - 1));
        await query(sql.slice(0, sql.length - 1), []);
    }

    DeleteEvents() {}

    CreateUsers(count: number) {}
    DeleteUsers() {}

    AddSubscriptions() {}
    DeleteSubscriptions() {}

    CreateScenario(dateRange: number, count: number) {}
    DeleteScenario() {}

    private GetUsers(count?: number) {}

    private GetRandomDate(from: Date, to: Date): Date {
        const fromTime = from.getTime();
        const toTime = to.getTime();

        return new Date(fromTime + Math.random() * (toTime - fromTime));
    }
}
