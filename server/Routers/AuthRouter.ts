import { Router } from "express";
import { AuthService } from "../Auth/impl/AuthService";
import { TwitchAuthParameters } from "../Auth/impl/TwitchAuthParameters";

const authService = new AuthService();

export const AuthRouter = Router();

AuthRouter.post("/", async (req, res) => {
    const result = await authService.Authenticate({
        access_token: req.body.access_token,
        refresh_token: req.body.refresh_token,
    } as TwitchAuthParameters);

    res.status(result.status).send(
        result.result == "success" ? result.data : result.message
    );
});
