import { Router, Request, Response } from "express";
import { IEventService } from "../Event/def/IEventService";
import { EventService } from "../Event/impl/EventService";

const eventService: IEventService = new EventService();
const EventRouter = Router();

EventRouter.get("/", async (req: Request, res: Response) => {
    const result = await eventService.GetUpcomingEvents(
        req.body.limit,
        req.body.page
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.post("/", async (req: Request, res: Response) => {
    const result = await eventService.CreateEvent(req.body);

    if (result) {
        res.status(201).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.get("/live", async (req: Request, res: Response) => {
    const result = await eventService.GetLiveEvents(
        req.body.limit,
        req.body.page
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.get("/featured", async (req: Request, res: Response) => {
    const result = await eventService.GetFeaturedEvents(
        req.body.limit,
        req.body.page
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.get("/category", async (req: Request, res: Response) => {
    const result = await eventService.GetEventsByTwitchCategory(
        req.body.category_id,
        req.body.limit,
        req.body.page
    );
});

EventRouter.use("/:event_id*", (req: Request, res: Response, next) => {
    req.body.event_id = req.params.event_id;
    next();
});

EventRouter.get("");
