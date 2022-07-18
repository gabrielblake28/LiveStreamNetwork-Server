import { IUser } from "../../User/def/IUser";
import { ISearchService } from "../def/ISearchService";
import { SearchResult } from "../def/SearchResult";
import { query } from "../../common/PostgresQuery";
import { SearchFactory } from "./SearchFactory";
import { ISearchFactory } from "../def/ISearchFactory";
import { IEvent } from "../../Event/def/IEvent";

export class SearchService implements ISearchService {
    private factory: ISearchFactory = new SearchFactory();

    async Search(term: string, type: string): Promise<SearchResult[]> {
        const searchResults: SearchResult[] = [];

        const providers = this.factory.CreateSearchProvider(type);

        for (let i = 0; i < providers.length; i++) {
            const result = await providers[i].SearchAsync(term);

            searchResults.push(result);
        }

        return searchResults;
    }
}
