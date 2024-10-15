"use server";
import { GetObjectCommand, ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getClient } from "./_client";

interface GetObjectParams {
    path: string;
}
export async function getFile({ path }: GetObjectParams) {
    const client = await getClient();
    const command: GetObjectCommand = new GetObjectCommand({
        Bucket: "swinx-invite-analysis",
        Key: path,
    });
    const response = await client.send(command);
    return response.Body?.transformToString();
}
