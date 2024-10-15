"use server";
import { ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getClient } from "./_client";

interface ListBucketParams {
    prefix?: string;
}
export async function listBucket({ prefix }: ListBucketParams = {}) {
    console.log("Listing bucket", prefix);
    const client = await getClient();
    const command: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: "swinx-invite-analysis",
        Delimiter: "/",
        Prefix: prefix,
    });
    const response = await client.send(command);
    return response;
}
