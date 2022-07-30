import { AuthStrategyParameters } from "../def/AuthStrategyParameters";

export interface TwitchAuthParameters extends AuthStrategyParameters {
    access_token: string;
    refresh_token?: string;
}
