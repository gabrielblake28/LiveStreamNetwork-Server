import { AuthStrategyParameters } from "../def/AuthStrategyParameters";
import { IAuthFactory } from "../def/IAuthFactory";
import { IAuthStrategy } from "../def/IAuthStrategy";
import { TwitchAppAuthParameters } from "./TwitchAppAuthParameters";
import { TwitchAppAuthStrategy } from "./TwitchAppAuthStrategy";
import { TwitchAuthParameters } from "./TwitchAuthParameters";
import { TwitchAuthStrategy } from "./TwitchAuthStrategy";

export class AuthFactory implements IAuthFactory {
    CreateStrategy(parameters: AuthStrategyParameters): IAuthStrategy {
        if (parameters instanceof TwitchAuthParameters) {
            return new TwitchAuthStrategy(parameters);
        } else if (parameters instanceof TwitchAppAuthParameters) {
            return new TwitchAppAuthStrategy(parameters);
        }

        throw new Error(
            "Error in creating AuthStrategy, invalid parameters supplied: " +
                parameters
        );
    }
}
