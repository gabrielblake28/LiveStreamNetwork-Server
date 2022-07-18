import { IFileUpload } from "./IFileUpload";

export interface IFileUploadService {
    /**
     * Upload a file with the given file data
     * @param resource file data
     * @returns message service message
     */
    uploadFile(resource: IFileUpload): Promise<any>;
}
