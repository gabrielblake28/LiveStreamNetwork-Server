import { Router } from "express";
import { SubscriptionService } from "../Subscriptions/impl/SubscriptionService";

const subscriptionService = new SubscriptionService();

export const SubscriptionRouter = Router();

SubscriptionRouter.get("/:subscription_id", async (req, res) => {
    const result = await subscriptionService.GetSubscription(
        req.params.subscription_id
    );

    res.status(result.status).send(
        "data" in result ? result.data : result.message
    );
});

SubscriptionRouter.get("/", async (req, res) => {
    const result = await subscriptionService.GetSubscriptionByEvent(
        req.query.event_id as string,
        req.query.user_id as string
    );

    res.status(result.status).send(
        "data" in result ? result.data : result.message
    );
});

SubscriptionRouter.post("/", async (req, res) => {
    const result = await subscriptionService.AddSubscription(req.body);

    res.status(result.status).send(
        "data" in result ? result.data : result.message
    );
});

SubscriptionRouter.delete("/:subscription_id", async (req, res) => {
    const result = await subscriptionService.RemoveSubscription(
        req.params.subscription_id
    );

    res.status(result.status).send(
        "data" in result ? result.data : result.message
    );
});
