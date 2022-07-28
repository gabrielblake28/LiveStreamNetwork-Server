import { Router, Request, Response } from "express";
import { IFeedbackService } from "../Feedback/def/IFeedbackService";
import { FeedbackService } from "../Feedback/impl/FeedbackService";

const feedbackService: IFeedbackService = new FeedbackService();

export const FeedbackRouter = Router();

FeedbackRouter.post("/", async (req: Request, res: Response) => {
    const result = await feedbackService.CreateFeedback(req.body);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
