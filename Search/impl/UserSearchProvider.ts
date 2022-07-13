import { query } from "../../common/PostgresQuery";
import { IUser } from "../../User/def/IUser";
import { SearchResult } from "../def/SearchResult";
import { ISearchProvider } from "../def/ISearchProvider";

export class UserSearchProvider implements ISearchProvider {
    async SearchAsync(term: string): Promise<SearchResult> {
        const sql = `Select * from search_display_names($1)`;

        const { rows } = await query(sql, [term]);

        return { Identifier: "users", Result: rows };
    }
}
