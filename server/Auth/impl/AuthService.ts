import {
    ResponsePayload,
    sendFailure,
    sendSuccess,
} from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";
import { AuthStrategyParameters } from "../def/AuthStrategyParameters";
import { IAuthService } from "../def/IAuthService";
import { TwitchAuthParameters } from "./TwitchAuthParameters";
import { TwitchAuthStrategy } from "./TwitchAuthStrategy";

export class AuthService implements IAuthService {
    async Authenticate(
        authParameters: AuthStrategyParameters
    ): Promise<ResponsePayload<IUser>> {
        try {
            const userDataResponse = await new TwitchAuthStrategy(
                authParameters as TwitchAuthParameters
            ).Authenticate();

            return userDataResponse.result == "success"
                ? sendSuccess(200, userDataResponse.data)
                : userDataResponse;
        } catch (e) {
            return sendFailure(500, (e as Error).message);
        }
    }
}
