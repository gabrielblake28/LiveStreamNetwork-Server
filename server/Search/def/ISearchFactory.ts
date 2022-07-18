import { ISearchProvider } from "./ISearchProvider";

export interface ISearchFactory {
    CreateSearchProvider(type: string): ISearchProvider[];
}
