import axios from "axios";
import { Router, Request, Response } from "express";
import { IUserService } from "../User/def/IUserService";
import { UserService } from "../User/impl/UserService";

const userService: IUserService = new UserService();
export const UserRouter = Router();

UserRouter.get("/:user_id", async (req: Request, res: Response) => {
    const result = await userService.GetUser(req.params.user_id);

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});

UserRouter.post("/:user_id", async (req: Request, res: Response) => {
    const result = await userService.UpdateUser(req.params.user_id, req.body);

    res.status(result.status).send(
        result.result == "success" ? result.data : result.message
    );
});
