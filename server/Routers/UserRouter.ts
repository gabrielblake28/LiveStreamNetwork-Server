import axios from "axios";
import { Router, Request, Response } from "express";
import { IUserService } from "../User/def/IUserService";
import { UserService } from "../User/impl/UserService";

const userService: IUserService = new UserService();
export const UserRouter = Router();

UserRouter.post("/", async (req: Request, res: Response) => {
    const twitchUser = await axios({
        url: "https://api.twitch.tv/helix/users",
        method: "GET",
        headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID as string,
            Authorization: "Bearer " + req.body.accessToken,
        },
    });

    if (twitchUser.data.error) {
        res.status(400).send(twitchUser.data.error);
    }

    const result = await userService.GetOrCreateUser(twitchUser.data.data[0]);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

UserRouter.get("/:user_id", async (req: Request, res: Response) => {
    const result = await userService.GetUser(req.params.user_id);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
