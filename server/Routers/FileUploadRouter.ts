import axios from "axios";
import e from "cors";
import { Router, Request, Response, application } from "express";
import { IFileUploadService } from "../Thumbnail/def/IFileUploadService";
import { FileUploadService } from "../Thumbnail/impl/FileUploadService";

const fileUploadService: IFileUploadService = new FileUploadService();
export const FileUploadRouter = Router();

FileUploadRouter.post("/", async (req: Request, res: Response) => {
    const result = await fileUploadService.uploadFile(req.body);

    if (result) {
        console.log(result);
        res.status(200).send(result);
    } else {
        res.status(400).send("ERROR");
    }
});
