import awsSDK from "aws-sdk";
import fs from "fs";

export async function upload(req: any, res: any) {
    let response = await uploadFile(req.file.originalname, req.file.path);
    res.send(response);
    res.end();
}

export function uploadFile(filename: string, fileDirectoryPath: string) {
    awsSDK.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const s3 = new awsSDK.S3();

    return new Promise(function (resolve, reject) {
        fs.readFile(fileDirectoryPath.toString(), function (err, data) {
            if (err) {
                reject(err);
            }
            s3.putObject(
                {
                    Bucket: "" + process.env.S3_BUCKET_NAME,
                    Key: filename,
                    Body: data,
                    ContentType: "image/jpeg",
                },
                function (err, data) {
                    if (err) reject(err);
                    resolve("succesfully uploaded");
                }
            );
        });
    });
}
