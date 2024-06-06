"use server";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "./amplifyServerUtils";
import { cookies } from "next/headers";
import config from "@/amplify_outputs.json";
import { Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import dayjs from "dayjs";
import "dayjs/locale/de";
import customParseFormat from "dayjs/plugin/customParseFormat";
import sanitize from "../utils/sanitize";
dayjs.extend(customParseFormat);

// export default { getUserGroups, getUserAttributes };
const client = generateServerClientUsingCookies<Schema>({ config, cookies });

export async function getUserGroups() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            const session = await fetchAuthSession(contextSpec, { forceRefresh: true });
            // console.log("-------------------------------");
            // console.log(client);
            // console.log(cookies(), "---\n", session);
            // console.log("-------------------------------");
            const payloadGroups =
                (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];
            // console.log(typeof payloadGroups);
            // if (!payloadGroups || typeof payloadGroups !== Json[]) return [];
            // console.log(payloadGroups);
            return payloadGroups;
        },
    });
    return result;
}
export async function getUserAttributes() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            // const session = await fetchAuthSession(contextSpec, { forceRefresh: true });
            const attributes = await fetchUserAttributes(contextSpec);
            return attributes;
        },
    });
    // console.log(result);
    return sanitize(result);
}

//#region Webinar

export async function getInviteBaseUrl() {
    const baseUrl = (process.env.BASE_URL ?? "www.google.com") + "/Response?data=";
    return baseUrl;
}

export async function getEnvironment() {
    const nodeEnv = process.env.NODE_ENV;
    const awsBranch = process.env.AWS_BRANCH;
    return { nodeEnv, awsBranch };
}
