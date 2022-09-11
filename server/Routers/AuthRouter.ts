import { Router } from "express";
import { AuthStrategyParameters } from "../Auth/def/AuthStrategyParameters";
import { AuthService } from "../Auth/impl/AuthService";
import { TwitchAppAuthParameters } from "../Auth/impl/TwitchAppAuthParameters";
import { TwitchAuthParameters } from "../Auth/impl/TwitchAuthParameters";

const authService = new AuthService();

export const AuthRouter = Router();

AuthRouter.post("/", async (req, res) => {
    let params: AuthStrategyParameters;

    if (req.body.app_token) {
        params = new TwitchAppAuthParameters(req.body.app_token);
    } else {
        params = new TwitchAuthParameters(
            req.body.access_token,
            req.body.refresh_token
        );
    }

    const result = await authService.Authenticate(params);

    res.status(result.status).send(
        result.result == "success" ? result.data : result.message
    );
});
