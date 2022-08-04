import { query } from "../../common/PostgresQuery";
import { IEvent } from "../../Event/def/IEvent";
import { SearchResult } from "../def/SearchResult";
import { ISearchProvider } from "../def/ISearchProvider";

export class EventSearchProvider implements ISearchProvider {
    async SearchAsync(term: string): Promise<SearchResult> {
        const sql = `Select * from "Events" ORDER BY SIMILARITY(title, $1) DESC
        LIMIT 15`;

        const { rows } = await query(sql, [term]);

        return { Identifier: "events", Result: rows };
    }
}
