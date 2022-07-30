import { ResponsePayload } from "../../common/message/MessageService";
import { IUser } from "../../User/def/IUser";

export interface IAuthStrategy {
    Authenticate(): Promise<ResponsePayload<IUser>>;
}
