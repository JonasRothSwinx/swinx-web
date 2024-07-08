import { Handler } from "aws-lambda";
import { reminders } from "./functions";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";

const env = process.env;

Amplify.configure(
    {
        API: {
            GraphQL: {
                endpoint: env.SWINX_WEB_DATA_GRAPHQL_ENDPOINT ?? "error", // replace with your defineData name
                region: env.AWS_REGION,
                defaultAuthMode: "identityPool",
            },
        },
    },
    {
        Auth: {
            credentialsProvider: {
                getCredentialsAndIdentityId: async () => ({
                    credentials: {
                        accessKeyId: env.AWS_ACCESS_KEY_ID ?? "",
                        secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "",
                        sessionToken: env.AWS_SESSION_TOKEN ?? "",
                    },
                }),
                clearCredentialsAndIdentityId: () => {
                    /* noop */
                },
            },
        },
    },
);
export const handler: Handler = async (event, context) => {
    const BASE_URL = process.env.BASE_URL;
    if (BASE_URL === "null") {
        return {
            statusCode: 500,
            body: JSON.stringify("BASE_URL not found"),
        };
    }
    // console.log("env: ", process.env);
    await reminders.start();
    // await dataClient.graphql({
    //     query: listEmailTriggers,
    // });

    return {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
    };
};
