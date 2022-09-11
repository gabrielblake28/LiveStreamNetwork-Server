import { AuthStrategyParameters } from "../def/AuthStrategyParameters";

export class TwitchAppAuthParameters implements AuthStrategyParameters {
    readonly app_token: string;

    constructor(app_token: string) {
        this.app_token = app_token;
    }
}
