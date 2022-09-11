import axios, { AxiosError } from "axios";
import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";
import { IUserService } from "../../User/def/IUserService";
import { UserService } from "../../User/impl/UserService";
import { IAuthStrategy } from "../def/IAuthStrategy";
import { TwitchAuthResponse } from "../def/TwitchAuthResponse";
import { TwitchAppAuthParameters } from "./TwitchAppAuthParameters";

export class TwitchAppAuthStrategy implements IAuthStrategy {
    private readonly app_token: string;
    private readonly userService: IUserService;

    constructor({ app_token }: TwitchAppAuthParameters) {
        this.app_token = app_token;

        if (!app_token) {
            throw new Error("App Token cannot be invalid");
        }
        this.userService = new UserService();
    }

    async Authenticate(): Promise<ResponsePayload<IUser>> {
        try {
            const {
                data: { access_token },
            } = await axios.post("https://id.twitch.tv/oauth2/token", {
                client_id: process.env.TWITCH_CLIENT_ID as string,
                client_secret: process.env.TWITCH_SECRET as string,
                grant_type: "client_credentials",
            });

            if (access_token) {
                const result = await axios({
                    url: "https://api.twitch.tv/helix/users",
                    method: "GET",
                    params: {
                        login: "calebblake31",
                    },
                    headers: {
                        "Client-ID": process.env.TWITCH_CLIENT_ID as string,
                        Authorization: "Bearer " + access_token,
                    },
                });

                const user = await this.userService.GetOrCreateUser(
                    result.data.data[0]
                );

                return sendSuccess(200, user);
            }

            return sendFailure(401, "Access token was not retrieved");
        } catch (e) {
            return sendFailure(
                401,
                JSON.stringify((e as AxiosError).response?.data) ||
                    "Twitch app authentication failed"
            );
        }
    }
}
