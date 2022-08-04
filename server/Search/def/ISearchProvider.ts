import { SearchResult } from "./SearchResult";

export interface ISearchProvider {
    SearchAsync(term: string): Promise<SearchResult>;
}
