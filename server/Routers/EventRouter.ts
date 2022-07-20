import { Router, Request, Response } from "express";
import multer from "multer";
import { IEventService } from "../Event/def/IEventService";
import { EventService } from "../Event/impl/EventService";
import fs from "fs";
import awsSDK from "aws-sdk";
import { resolveModuleName } from "typescript";
import { v4 as uuidv4 } from "uuid";

const eventService: IEventService = new EventService();
const storage = multer.memoryStorage();
const Upload = multer({ storage: storage });

export const EventRouter = Router();

EventRouter.get("/", async (req: Request, res: Response) => {
    const result = await eventService.GetUpcomingEvents(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string),
        req.query.user_id as string
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.post(
    "/",
    Upload.single("file"),
    async (req: Request, res: Response) => {
        awsSDK.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        });
        const s3 = new awsSDK.S3();

        const response = await s3
            .upload({
                Bucket: "" + process.env.S3_BUCKET_NAME,
                Key: uuidv4(),
                Body: req.file?.buffer,
                ContentType: "image/jpeg",
            })
            .promise();

        const result = await eventService.CreateEvent(
            Object.assign({}, req.body, { image: response.Location })
        );

        if (result) {
            res.status(201).send(result);
        } else {
            res.status(400).send("ERROR");
        }
    }
);

EventRouter.get("/trending", async (req, res) => {
    const result = await eventService.GetTrendingEvents(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string),
        req.query.user_id as string
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.get("/live", async (req: Request, res: Response) => {
    const result = await eventService.GetLiveEvents(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string),
        req.query.user_id as string
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.get("/featured", async (req: Request, res: Response) => {
    const result = await eventService.GetFeaturedEvents(
        parseInt(req.query.limit as string),
        parseInt(req.query.page as string),
        req.query.user_id as string
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

EventRouter.get("/:event_id", async (req: Request, res: Response) => {
    const result = await eventService.GetEvent(req.body.event_id);
    return res.status(200).send(result);
});

EventRouter.get("/subscribed/:user_id", async (req: Request, res: Response) => {
    const result = await eventService.GetSubscribedEvents(req.params.user_id);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

EventRouter.delete("/:event_id", async (req: Request, res: Response) => {
    const result = await eventService.DeleteEvent(req.body.event_id);

    res.status(200).send(result);
});
