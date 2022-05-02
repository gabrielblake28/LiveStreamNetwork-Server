import { Router, Request, Response } from "express";
import { ITwitchUserService } from "../TwitchUser/def/ITwitchUserService";
import { TwitchUserService } from "../TwitchUser/impl/TwitchUserService";

const twitchUserService: ITwitchUserService = new TwitchUserService();
export const TwitchUserRouter = Router();

TwitchUserRouter.post("/", async (req: Request, res: Response) => {
    const result = await twitchUserService.CreateUser(req.body);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
