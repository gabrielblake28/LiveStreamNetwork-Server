import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai, { expect } from "chai";
import { EventService } from "../Event/impl/EventService";
import { IEvent } from "../Event/def/IEvent";

let sandbox: sinon.SinonSandbox;
let eventService: EventService;
describe("Event Service", () => {
    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        eventService = new EventService();
    });

    describe("Should be able to fetch live events", () => {
        it("Should return all live events at the specified  date, limit, and offset", async () => {
            const expectedResult: IEvent[] = [
                {
                    category_id: "3",
                    start_timestamp: new Date("2022-09-22T08:30:00"),
                    end_timestamp: new Date("2022-09-22T13:30:00"),
                    event_id: "3",
                    featured: true,
                    title: "final project",
                    user_id: "1",
                    description: "",
                    image: "",
                },
                {
                    category_id: "3",
                    start_timestamp: new Date("2022-09-22T10:30:00"),
                    end_timestamp: new Date("2022-09-22T11:30:00"),
                    event_id: "4",
                    featured: true,
                    title: "Some Other Project",
                    user_id: "3",
                    description: "generic blah blah",
                    image: "asdf",
                },
                {
                    category_id: "4",
                    start_timestamp: new Date("2022-09-22T06:30:00"),
                    end_timestamp: new Date("2022-09-22T14:30:00"),
                    event_id: "5",
                    featured: false,
                    title: "Another Project",
                    user_id: "4",
                    description: "proj",
                    image: "proj",
                },
            ];
            const results = await eventService.GetLiveEvents(
                3,
                0,
                new Date("2022-09-22T11:30")
            );

            expect(results).to.eql(expectedResult);
        });

        // it("Should return all live events at the specified ");
    });

    describe("Should be able to fetch featured events", () => {
        it("Should return a list of featured events", async () => {
            const expectedResult: IEvent[] = [
                {
                    category_id: "3",
                    start_timestamp: new Date("2022-09-22T08:30:00"),
                    end_timestamp: new Date("2022-09-22T13:30:00"),
                    event_id: "3",
                    featured: true,
                    title: "final project",
                    user_id: "1",
                    description: "",
                    image: "",
                },
                {
                    event_id: "6",
                    title: "Was Live At Some Point\n",
                    description: "asdf",
                    image: "was live\n",
                    featured: true,
                    category_id: "4",
                    user_id: "1",
                    start_timestamp: new Date(
                        "Thu Sep 22 2022 09:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                    end_timestamp: new Date(
                        "Thu Sep 22 2022 14:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                },
            ];

            const result = await eventService.GetFeaturedEvents(2, 0);

            expect(result).to.eql(expectedResult);
        });
    });

    describe("Should be able to fetch events from all followed user_ids", () => {
        it("Should return all matching events from a list of user_ids", async () => {
            const expectedResult: IEvent[] = [
                {
                    event_id: "1",
                    title: "Some Project random",
                    description: "Some generic description",
                    image: "blah blah blah",
                    featured: false,
                    category_id: "1",
                    user_id: "1",
                    start_timestamp: new Date(
                        "Mon Oct 24 2022 10:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                    end_timestamp: new Date(
                        "Mon Oct 24 2022 12:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                },
                {
                    event_id: "2",
                    title: "Second Project",
                    description: "more random projects",
                    image: "hah hah hah",
                    featured: false,
                    category_id: "2",
                    user_id: "2",
                    start_timestamp: new Date(
                        "Thu Nov 24 2022 11:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                    end_timestamp: new Date(
                        "Thu Nov 24 2022 13:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                },
                {
                    event_id: "3",
                    title: "final project",
                    description: "",
                    image: "",
                    featured: true,
                    category_id: "3",
                    user_id: "1",
                    start_timestamp: new Date(
                        "Thu Sep 22 2022 08:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                    end_timestamp: new Date(
                        "Thu Sep 22 2022 13:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                },
            ];

            const result = await eventService.GetEventsWithMatchingUserIds(
                3,
                0,
                ["1", "2"]
            );

            expect(result).to.eql(expectedResult);
        });
    });

    describe("Should be able to paginate event fetches and pull events by pages", () => {
        it("Should pull events for specified limit {5} and offset {0}", async () => {
            const expectedResult: IEvent[] = [
                {
                    event_id: "1",
                    title: "Some Project random",
                    description: "Some generic description",
                    image: "blah blah blah",
                    featured: false,
                    category_id: "1",
                    user_id: "1",
                    start_timestamp: new Date(
                        "Mon Oct 24 2022 10:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                    end_timestamp: new Date(
                        "Mon Oct 24 2022 12:30:00 GMT-0700 (Pacific Daylight Time)"
                    ),
                },
                {
                    event_id: "2",
                    title: "Second Project",
                    description: "more random projects",
                    image: "hah hah hah",
                    featured: false,
                    category_id: "2",
                    user_id: "2",
                    start_timestamp: new Date(
                        "Thu Nov 24 2022 11:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                    end_timestamp: new Date(
                        "Thu Nov 24 2022 13:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                },
            ];

            const result = await eventService.GetUpcomingEvents(
                5,
                0,
                new Date("2022-10-23T08:30")
            );

            expect(result).to.eql(expectedResult);
        });

        it("Should pull events for specified limit {4} and offset {1}", async () => {
            const expectedResult: IEvent[] = [
                {
                    event_id: "2",
                    title: "Second Project",
                    description: "more random projects",
                    image: "hah hah hah",
                    featured: false,
                    category_id: "2",
                    user_id: "2",
                    start_timestamp: new Date(
                        "Thu Nov 24 2022 11:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                    end_timestamp: new Date(
                        "Thu Nov 24 2022 13:30:00 GMT-0800 (Pacific Standard Time)"
                    ),
                },
            ];

            const result = await eventService.GetUpcomingEvents(
                4,
                1,
                new Date("2022-09-22T07:30")
            );

            expect(result).to.eql(expectedResult);
        });
    });

    it("Should be able to fetch event for one user_id", async () => {
        const expectedResult: IEvent[] = [
            {
                event_id: "2",
                title: "Second Project",
                description: "more random projects",
                image: "hah hah hah",
                featured: false,
                category_id: "2",
                user_id: "2",
                start_timestamp: new Date(
                    "Thu Nov 24 2022 11:30:00 GMT-0800 (Pacific Standard Time)"
                ),
                end_timestamp: new Date(
                    "Thu Nov 24 2022 13:30:00 GMT-0800 (Pacific Standard Time)"
                ),
            },
        ];

        const result = await eventService.GetEventsWithMatchingUserIds(3, 0, [
            "2",
        ]);

        expect(result).to.eql(expectedResult);
    });

    it("Should be able to get an event by id", async () => {
        const event: IEvent = {
            event_id: "2",
            title: "Second Project",
            description: "more random projects",
            image: "hah hah hah",
            featured: false,
            category_id: "2",
            user_id: "2",
            start_timestamp: new Date(
                "Thu Nov 24 2022 11:30:00 GMT-0800 (Pacific Standard Time)"
            ),
            end_timestamp: new Date(
                "Thu Nov 24 2022 13:30:00 GMT-0800 (Pacific Standard Time)"
            ),
        };

        const result = await eventService.GetEvent("2");

        expect(result).to.eql(event);
    });

    it("Should create an event with given resource and event should be able to query event with returned id", async () => {
        let eventData: IEvent = {
            category_id: "1",
            end_timestamp: new Date("2021-11-24T01:30"),
            featured: true,
            start_timestamp: new Date("2021-11-25T02:30"),
            title: "My Newly Created Event",
            description: "some description",
            user_id: "99999999999",
            image: "asdf",
        };

        const eventId = await eventService.CreateEvent(eventData);

        const event = await eventService.GetEvent(eventId);

        expect(event).to.eql(Object.assign(eventData, { event_id: eventId }));

        await eventService.DeleteEvent(eventId);
    });

    it("should delete an event", async () => {
        let eventData: IEvent = {
            category_id: "1",
            end_timestamp: new Date("2021-11-24T01:30"),
            featured: true,
            start_timestamp: new Date("2021-11-25T02:30"),
            title: "My Newly Created Event",
            description: "some description",
            user_id: "99999999999",
            image: "asdf",
        };

        const eventId = await eventService.CreateEvent(eventData);

        const event = await eventService.GetEvent(eventId);

        expect(event).to.eql(Object.assign(eventData, { event_id: eventId }));

        await eventService.DeleteEvent(eventId);

        expect(await eventService.GetEvent(eventId)).to.eql(undefined);
    });

    it("Should be able to change an event", async () => {
        let eventData: IEvent = {
            category_id: "1",
            end_timestamp: new Date("2021-11-24T01:30"),
            featured: true,
            start_timestamp: new Date("2021-11-25T02:30"),
            title: "My Newly Created Event",
            description: "some description",
            user_id: "99999999999",
            image: "asdf",
        };

        const eventId = await eventService.CreateEvent(eventData);

        const event = await eventService.UpdateEvent(
            eventId,
            Object.assign(eventData, { description: "Some other description" })
        );

        expect(event).to.not.eql(eventData);

        expect(event).to.eql(
            Object.assign(eventData, {
                description: "Some other description",
                event_id: eventId,
            })
        );

        eventService.DeleteEvent(eventId);
    });

    describe("Should be able to manage event subscriptions", () => {
        it("Should return true when user is subscribed to an event", async () => {
            expect(await eventService.IsSubscribedToEvent("2", "3")).to.equal(
                false
            );

            const subcriptionId = await eventService.SubscribeToEvent("2", "3");

            expect(await eventService.IsSubscribedToEvent("2", "3")).to.equal(
                true
            );

            await eventService.UnsubscribeToEvent(subcriptionId);

            expect(await eventService.IsSubscribedToEvent("2", "3")).to.equal(
                false
            );
        });
    });

    it("Should be able to fetch events by Twitch Category", async () => {
        const expectedResult: IEvent[] = [
            {
                category_id: "3",
                start_timestamp: new Date("2022-09-22T08:30:00"),
                end_timestamp: new Date("2022-09-22T13:30:00"),
                event_id: "3",
                featured: true,
                title: "final project",
                user_id: "1",
                description: "",
                image: "",
            },
            {
                category_id: "3",
                start_timestamp: new Date("2022-09-22T10:30:00"),
                end_timestamp: new Date("2022-09-22T11:30:00"),
                event_id: "4",
                featured: true,
                title: "Some Other Project",
                user_id: "3",
                description: "generic blah blah",
                image: "asdf",
            },
        ];

        const result = await eventService.GetEventsByTwitchCategory(
            "3",
            5,
            0,
            new Date("2022-09-22T08:30:00")
        );

        expect(result).to.eql(expectedResult);
    });

    //Should be able to search an event
});
