import { AuthStrategyParameters } from "./AuthStrategyParameters";
import { IAuthStrategy } from "./IAuthStrategy";

export interface IAuthFactory {
    CreateStrategy(parameters: AuthStrategyParameters): IAuthStrategy;
}
