"use server";

import { SESv2Client } from "@aws-sdk/client-sesv2";
// import dotenv from "dotenv";

const client: { client: SESv2Client | null } = { client: null };
function generateClient() {
    // dotenv.config({ path: ".env.local" });
    // console.log(process.env);
    const accessKeyId = process.env.SES_ACCESS_KEY;
    const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS credentials not set. Define env values.");
    }
    client.client = new SESv2Client({
        region: "eu-west-1",
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}
export default async function getSESClient(): Promise<SESv2Client> {
    if (client.client === null) {
        generateClient();
    }
    if (client.client === null) {
        throw new Error("Client not generated");
    }
    return client.client;
}
