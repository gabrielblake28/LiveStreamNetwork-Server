import { IEvent } from "../../Event/def/IEvent";
import { IUser } from "../../User/def/IUser";

export interface SearchResult {
    Identifier: "users" | "events";
    Result: IUser[] | IEvent[];
}
