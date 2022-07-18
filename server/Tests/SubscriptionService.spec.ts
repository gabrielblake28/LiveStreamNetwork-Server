import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai, { expect } from "chai";
import { SubscriptionService } from "../Subscriptions/impl/SubscriptionService";
import { ISubscriptionService } from "../Subscriptions/def/ISubscriptionService";
import { ErrorPayload, SuccessPayload } from "../common/message/MessageService";
import { ISubscription } from "../Subscriptions/def/ISubscription";
import * as PostGresQuery from "../common/PostgresQuery";
import e from "cors";

let stub: sinon.SinonStub;
let sandbox: sinon.SinonSandbox;
let subscriptionService: ISubscriptionService;

const EVENT_ID = "289";
const USER_ID = "50";
const ERROR = new Error("ERROR");

describe.only("Subscription Service", () => {
    before(() => {
        sandbox = sinon.createSandbox();
        stub = sandbox.stub();
    });
    beforeEach(() => {
        subscriptionService = new SubscriptionService();
    });
    afterEach(() => {
        sandbox.restore();
    });

    describe("Should get subscription by EventId and UserId", () => {
        beforeEach(async () => {
            await subscriptionService.AddSubscription({
                event_id: EVENT_ID,
                user_id: USER_ID,
            });
        });
        it("Should send 200 and the subscription when eventId and UserId exists", async () => {
            const result = await subscriptionService.GetSubscriptionByEvent(
                EVENT_ID,
                USER_ID
            );

            if ("data" in result) {
                expect(result.data.event_id).to.equal(EVENT_ID);
                expect(result.data.user_id).to.equal(USER_ID);
            } else {
                throw new Error("result was failure");
            }
        });

        it("Should send 404 when the subscription does not exist", async () => {
            const result = await subscriptionService.GetSubscriptionByEvent(
                "-1",
                USER_ID
            );

            if ("message" in result) {
                expect(result.status).to.equal(404);

                expect(result.message).to.equal(
                    "No subscription found for event: -1"
                );
            } else {
                throw new Error("result was success");
            }
        });

        it("Should send 500 when error is thrown", async () => {
            stub = sandbox.stub(PostGresQuery, "query").throws(ERROR);

            const result = await subscriptionService.GetSubscriptionByEvent(
                EVENT_ID,
                USER_ID
            );

            if ("message" in result) {
                expect(result.status).to.equal(500);
                expect(result.message).to.equal(ERROR.message);
            } else {
                throw new Error("Result was success");
            }
        });
    });

    describe("Should add a Subscription", () => {
        it("Should add a subscription and send status of 201", async () => {
            const result = await subscriptionService.AddSubscription({
                event_id: EVENT_ID,
                user_id: USER_ID,
            });

            if ("data" in result) {
                expect(result.data).to.be.a("string");

                await subscriptionService.RemoveSubscription(result.data);
            } else {
                throw new Error("result failed");
            }
        });

        it("Should send status 500 when error is thrown", async () => {
            stub = sandbox.stub(PostGresQuery, "query").throws(ERROR);

            const result = await subscriptionService.AddSubscription({
                event_id: EVENT_ID,
                user_id: USER_ID,
            });

            if ("message" in result) {
                expect(result.message).to.equal(ERROR.message);
                expect(result.status).to.equal(500);
            } else {
                throw new Error("result was success");
            }
        });
    });

    describe("Should remove a subscription", () => {
        it("Should send status 204 and send successfully deleted", async () => {
            const subscription_id = await subscriptionService.AddSubscription({
                event_id: EVENT_ID,
                user_id: USER_ID,
            });

            if ("data" in subscription_id) {
                const result = await subscriptionService.RemoveSubscription(
                    subscription_id.data
                );

                if ("data" in result) {
                    expect(result.data).to.equal(
                        "Successfully deleted subscription"
                    );
                } else {
                    throw new Error("result failed");
                }
            } else {
                throw new Error("result failed");
            }
        });

        it("Should send status 500 when error is thrown", async () => {
            stub = sandbox.stub(PostGresQuery, "query").throws(ERROR);

            const result = await subscriptionService.RemoveSubscription("asdf");

            if ("message" in result) {
                expect(result.message).to.equal(ERROR.message);
                expect(result.status).to.equal(500);
            } else {
                throw new Error("result succeeded");
            }
        });
    });

    describe("Should get a subscription by id", () => {
        it("Should send status 200 and get subscription", async () => {
            const subscription_id = await subscriptionService.AddSubscription({
                event_id: EVENT_ID,
                user_id: USER_ID,
            });

            if ("data" in subscription_id) {
                const result = await subscriptionService.GetSubscription(
                    subscription_id.data
                );

                if ("data" in result) {
                    expect(result.data.subscription_id).to.equal(
                        subscription_id.data
                    );
                    expect(result.data.event_id).to.equal(EVENT_ID);
                    expect(result.data.user_id).to.equal(USER_ID);
                } else {
                    throw new Error("result failed");
                }

                await subscriptionService.RemoveSubscription(
                    subscription_id.data
                );
            } else {
                throw new Error("result failed");
            }
        });
    });
});
