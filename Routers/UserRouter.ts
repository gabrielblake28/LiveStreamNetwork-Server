import { Router, Request, Response } from "express";
import { IUserService } from "../User/def/IUserService";
import { UserService } from "../User/impl/UserService";

const userService: IUserService = new UserService();
const UserRouter = Router();

UserRouter.post("/", async (req: Request, res: Response) => {
    const result: any = await userService.AuthenticateUser(
        req.body.username,
        req.body.password
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(200).send("ERROR");
    }
});

UserRouter.get("/", async (req: Request, res: Response) => {
    const result = await userService.GetUser(req.body.user_id);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

UserRouter.post("/", async (req: Request, res: Response) => {
    const result = await userService.CreateUser(req.body);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
