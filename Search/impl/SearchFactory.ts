import { ISearchFactory } from "../def/ISearchFactory";
import { ISearchProvider } from "../def/ISearchProvider";
import { EventSearchProvider } from "./EventSearchProvider";
import { UserSearchProvider } from "./UserSearchProvider";

export class SearchFactory implements ISearchFactory {
    CreateSearchProvider(type: string): ISearchProvider[] {
        const searchProviders: ISearchProvider[] = [];

        if (["all", "users"].includes(type)) {
            searchProviders.push(new UserSearchProvider());
        }

        if (["all", "events"].includes(type)) {
            searchProviders.push(new EventSearchProvider());
        }

        return searchProviders;
    }
}
