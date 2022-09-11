import { ResponsePayload } from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";
import { AuthStrategyParameters } from "./AuthStrategyParameters";

export interface IAuthService {
    Authenticate(
        authParameters: AuthStrategyParameters
    ): Promise<ResponsePayload<IUser>>;
}
