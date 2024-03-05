import { SESv2Client } from "@aws-sdk/client-sesv2";

const client = new SESv2Client({
    region: "eu-west-1",
});

export default client;
