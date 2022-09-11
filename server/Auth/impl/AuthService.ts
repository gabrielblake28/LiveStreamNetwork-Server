import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";
import { AuthStrategyParameters } from "../def/AuthStrategyParameters";
import { IAuthService } from "../def/IAuthService";
import { AuthFactory } from "./AuthFactory";
import { TwitchAuthParameters } from "./TwitchAuthParameters";
import { TwitchAuthStrategy } from "./TwitchAuthStrategy";

export class AuthService implements IAuthService {
    private authFactory = new AuthFactory();
    async Authenticate(
        authParameters: AuthStrategyParameters
    ): Promise<ResponsePayload<IUser>> {
        try {
            const userDataResponse = await this.authFactory
                .CreateStrategy(authParameters)
                .Authenticate();

            return userDataResponse.result == "success"
                ? sendSuccess(200, userDataResponse.data)
                : userDataResponse;
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }
}
