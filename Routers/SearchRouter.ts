import { Router, Request, Response } from "express";
import { ISearchService } from "../Search/def/ISearchService";
import { SearchService } from "../Search/impl/SearchService";

const searchService: ISearchService = new SearchService();
export const SearchRouter = Router();

SearchRouter.get("/", async (req: Request, res: Response) => {
    const result = await searchService.Search(
        req.query.term as string,
        req.query.type as string
    );

    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
