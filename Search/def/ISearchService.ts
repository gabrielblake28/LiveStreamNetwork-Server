import { SearchResult } from "./SearchResult";

export interface ISearchService {
    Search(term: string, type: string): Promise<SearchResult[]>;
}
