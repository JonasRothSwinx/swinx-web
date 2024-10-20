"use server";
import outputs from "@/amplify_outputs.json";
import { getClient } from "./_client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

interface DownloadFileParams {
    path: string;
}

export async function downloadFile({ path }: DownloadFileParams) {
    const client = await getClient();
    const params = {
        Bucket: outputs.custom.inviteBucket.name,
        Key: path,
    };
    const command: GetObjectCommand = new GetObjectCommand(params);
    const data = await client.send(command);
    return data;
}
