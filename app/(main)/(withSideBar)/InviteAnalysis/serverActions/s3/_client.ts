/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use server";
import { S3Client } from "@aws-sdk/client-s3";
import outputs from "@/amplify_outputs.json";

let client: S3Client | null = null;
function generateClient(): S3Client {
    const region = outputs.custom.inviteBucket?.region;
    const accessKeyId = process.env.SES_ACCESS_KEY;
    const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS credentials not set. Define env values.");
    }
    client = new S3Client({
        region: outputs.custom.inviteBucket.region,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
    return client;
}
export async function getClient() {
    if (client === null) {
        return generateClient();
    }
    return client;
}
