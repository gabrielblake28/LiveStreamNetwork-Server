import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai, { expect } from "chai";
import { EventService } from "../Event/impl/EventService";
import { IEvent } from "../Event/def/IEvent";
import * as pgQuery from "../common/PostgresQuery";

const error = new Error("Error");

let sandbox: sinon.SinonSandbox;
let eventService: EventService;
let stubQuery: sinon.SinonStub;

const expectedResult: IEvent[] = [
    {
        start_timestamp: new Date("2022-09-22T08:30:00"),
        end_timestamp: new Date("2022-09-22T13:30:00"),
        event_id: "3",
        featured: true,
        title: "final project",
        user_id: "1",
        description: "",
        image: "",
        aws_image_key: "",
        created_for_test: false,
    },
    {
        start_timestamp: new Date("2022-09-22T10:30:00"),
        end_timestamp: new Date("2022-09-22T11:30:00"),
        event_id: "4",
        featured: true,
        title: "Some Other Project",
        user_id: "3",
        description: "generic blah blah",
        image: "asdf",
        aws_image_key: "",
        created_for_test: false,
    },
    {
        start_timestamp: new Date("2022-09-22T06:30:00"),
        end_timestamp: new Date("2022-09-22T14:30:00"),
        event_id: "5",
        featured: false,
        title: "Another Project",
        user_id: "4",
        description: "proj",
        image: "proj",
        aws_image_key: "",
        created_for_test: false,
    },
];

describe("Event Service", () => {
    afterEach(() => {
        sandbox.restore();
    });

    beforeEach(() => {
        eventService = new EventService();
        sandbox = sinon.createSandbox();
        stubQuery = sandbox.stub(pgQuery, "query");
    });

    describe("Should be able to fetch live events", () => {
        it("Should return all live events at the specified  date, limit, and offset", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.GetLiveEvents(1, 1, "");

            expect(result.result).equal("success");

            expect(result.status).equal(200);

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult);
            }
        });

        it("Test return results when error thrown", async () => {
            stubQuery.throws(error);
            const result = await eventService.GetLiveEvents(1, 1, "");

            expect(result.result).equal("error");
            expect(result.status).equal(500);

            if (result.result == "error") {
                expect(result.message).equal(error.message);
            }
        });
    });

    describe("Should be able to fetch featured events", () => {
        it("Test return result when query passes", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.GetFeaturedEvents(1, 1, "");

            expect(result.status).equals(200);
            expect(result.result).equal("success");

            if (result.result == "success") {
                expect(result.data).equal(expectedResult);
            }
        });

        it("Test return result when query fails", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetFeaturedEvents(1, 1, "");

            expect(result.status).equal(500);
            expect(result.result).equal("error");

            if (result.result == "error") {
                expect(result.message).equal(error.message);
            }
        });
    });

    describe("Should fetch events for a specific user", () => {
        it("Test return result for fetching user events", async () => {
            stubQuery.returns({ rows: expectedResult });

            const result = await eventService.GetEventsWithMatchingUserIds(
                1,
                1,
                ""
            );

            expect(result.status).to.equal(200);
            expect(result.result).to.equal("success");

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult);
            }
        });

        it("Test return result when fetching user events fails", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetEventsWithMatchingUserIds(
                1,
                1,
                "",
                new Date("10-20-2020")
            );

            expect(result.status).to.equal(500);

            expect(result.result).to.equal("error");

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should fetch upcoming events", () => {
        it("Test result from fetching upcoming events", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.GetUpcomingEvents(1, 1, "");

            expect(result.status).to.equal(200);
            expect(result.result).to.equal("success");

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult);
            }
        });

        it("Test result from failing to fetch upcoming events", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetUpcomingEvents(1, 1, "");

            expect(result.status).to.equal(500);
            expect(result.result).to.equal("error");

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should fetch an event by event_id", () => {
        it("Test result of fetching event by event_id", async () => {
            stubQuery.resolves({ rows: expectedResult });
            const result = await eventService.GetEvent("2", "2");

            expect(result.status).to.equal(200);
            expect(result.result).to.equal("success");

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult[0]);
            }
        });

        it("Test result when fetching event by event_id fails", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetEvent("123123123123", "2");

            expect(result.status).to.equal(500);
            expect(result.result).to.equal("error");

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should delete an event", () => {
        it("Test result when an event is deleted", async () => {
            const result = await eventService.DeleteEvent("2");

            expect(result.result).to.equal("success");
            expect(result.status).to.equal(204);

            if (result.result == "success") {
                expect(result.data).to.eql("Event 2 successfully deleted");
            }
        });

        it("Test result when failed to delete event", async () => {
            stubQuery.throws(error);

            const result = await eventService.DeleteEvent("3");

            expect(result.result).to.equal("error");
            expect(result.status).to.equal(500);

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should update an event", () => {
        it("Test result of updating an event", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.UpdateEvent(
                "2",
                expectedResult[0]
            );

            expect(result.result).to.equal("success");
            expect(result.status).to.equal(200);

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult[0]);
            }
        });

        it("Test result of failing to update an event", async () => {
            stubQuery.throws(error);

            const result = await eventService.UpdateEvent(
                "2",
                expectedResult[0]
            );

            expect(result.result).to.equal("error");
            expect(result.status).to.equal(500);

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should create an event", () => {
        it("Test result of creating an event", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.CreateEvent(expectedResult[0]);

            expect(result.status).to.equal(201);
            expect(result.result).to.equal("success");

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult[0].event_id);
            }
        });

        it("Test result of failing to create an evnet", async () => {
            stubQuery.throws(error);

            const result = await eventService.CreateEvent(expectedResult[0]);

            expect(result.status).to.equal(500);
            expect(result.result).to.equal("error");

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should get sponsored events", () => {
        it("Test result of fetching sponsored events", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.GetSponsoredEvents(1, 1, "");

            expect(result.result).to.equal("success");
            expect(result.status).to.equal(200);

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult);
            }
        });

        it("Test result of failing to fetch sponsored events", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetSponsoredEvents(1, 1, "");

            expect(result.status).to.equal(500);
            expect(result.result).to.equal("error");

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });

    describe("Should Get events a user has subscribed to", () => {
        it("Test result of fetching events a user has subscribed to", async () => {
            stubQuery.resolves({ rows: expectedResult });

            const result = await eventService.GetSubscribedEvents("1");

            expect(result.result).to.equal("success");

            expect(result.status).to.equal(200);

            if (result.result == "success") {
                expect(result.data).to.equal(expectedResult);
            }
        });

        it("Test result of failing to fetch events a user has subscribed to", async () => {
            stubQuery.throws(error);

            const result = await eventService.GetSubscribedEvents("1");

            expect(result.result).to.equal("error");

            expect(result.status).to.equal(500);

            if (result.result == "error") {
                expect(result.message).to.equal(error.message);
            }
        });
    });
});
