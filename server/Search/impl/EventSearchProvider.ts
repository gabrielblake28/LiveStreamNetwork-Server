import { query } from "../../common/PostgresQuery";
import { IEvent } from "../../Event/def/IEvent";
import { SearchResult } from "../def/SearchResult";
import { ISearchProvider } from "../def/ISearchProvider";

export class EventSearchProvider implements ISearchProvider {
    async SearchAsync(term: string): Promise<SearchResult> {
        const sql = `Select * from search_event_titles($1)`;

        const { rows } = await query(sql, [term]);

        return { Identifier: "events", Result: rows };
    }
}
