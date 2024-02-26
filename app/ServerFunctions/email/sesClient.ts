import { SESClient } from "@aws-sdk/client-ses";

const client = new SESClient({
    region: "eu-west-1",
});

export default client;
