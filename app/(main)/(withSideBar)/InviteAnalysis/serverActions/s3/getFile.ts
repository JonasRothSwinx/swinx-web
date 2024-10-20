"use server";
import {
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getClient } from "./_client";

interface GetObjectParams {
    path: string;
}
async function getFile({ path }: GetObjectParams) {
    const client = await getClient();
    const command: GetObjectCommand = new GetObjectCommand({
        Bucket: "swinx-invite-analysis",
        Key: path,
    });
    const response = await client.send(command);
    return response;
}

export async function getFileByteArray({ path }: GetObjectParams) {
    const response = await getFile({ path });
    return await response.Body?.transformToByteArray();
}
export async function getFileString({ path }: GetObjectParams) {
    const response = await getFile({ path });
    return await response.Body?.transformToString();
}
