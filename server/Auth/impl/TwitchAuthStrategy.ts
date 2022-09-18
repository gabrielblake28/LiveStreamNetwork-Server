import { IAuthStrategy } from "../def/IAuthStrategy";
import { UserService } from "../../User/impl/UserService";
import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";
import axios, { AxiosError } from "axios";
import { IUserService } from "../../User/def/IUserService";
import { TwitchAuthParameters } from "./TwitchAuthParameters";
import { TwitchAuthResponse } from "../def/TwitchAuthResponse";

export class TwitchAuthStrategy implements IAuthStrategy {
    private readonly access_token: string;
    private readonly refresh_token?: string;
    private readonly userService: IUserService;

    constructor({ access_token, refresh_token }: TwitchAuthParameters) {
        this.access_token = access_token;

        if (!access_token) {
            throw new Error("Access token cannot be invalid");
        }
        this.refresh_token = refresh_token;
        this.userService = new UserService();
    }

    async Authenticate(): Promise<ResponsePayload<IUser>> {
        const initialAuthAttempt = await this.TryAuthenticateAccessToken(
            this.access_token
        );

        if (initialAuthAttempt.result == "success") {
            const result = await this.userService.GetOrCreateUser(
                initialAuthAttempt.data
            );

            return sendSuccess(200, result);
        } else {
            if (!this.refresh_token) {
                return sendFailure(400, "Access token is invalid");
            }

            const finalAuthAttempt = await this.TryAuthenticateRefreshToken();

            if (finalAuthAttempt.result == "success") {
                const result = await this.userService.GetOrCreateUser(
                    finalAuthAttempt.data
                );

                return sendSuccess(
                    200,

                    result
                );
            } else {
                return finalAuthAttempt;
            }
        }
    }

    private async TryAuthenticateAccessToken(
        access_token: string
    ): Promise<ResponsePayload<TwitchAuthResponse>> {
        try {
            const result = await axios({
                url: "https://api.twitch.tv/helix/users",
                method: "GET",
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID as string,
                    Authorization: "Bearer " + access_token,
                },
            });

            return sendSuccess<TwitchAuthResponse>(200, result.data.data[0]);
        } catch (e) {
            return sendFailure(401, (e as Error).message);
        }
    }

    private async TryAuthenticateRefreshToken(): Promise<
        ResponsePayload<TwitchAuthResponse>
    > {
        try {
            if (!this.refresh_token) {
                throw new Error("Refresh token is invalid");
            }

            const requestAccessToken = await axios.post(
                "https://id.twitch.tv/oauth2/token",
                {
                    client_id: process.env.TWITCH_CLIENT_ID as string,
                    client_secret: process.env.TWITCH_SECRET as string,
                    grant_type: "refresh_token",
                    refresh_token: this.refresh_token,
                }
            );

            return await this.TryAuthenticateAccessToken(
                requestAccessToken.data.access_token
            );
        } catch (e) {
            return sendFailure(401, JSON.stringify((e as AxiosError).toJSON()));
        }
    }
}
