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
            const payloadGroups = (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];
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
    console.log(result);
    return sanitize(result);
}

//#region Webinar
interface WebinarNew {
    title: string;
    date: string;
}
interface WebinarUpdate {
    id: string;
    title?: string;
    date?: string;
}
// export async function parseWebinarFormData(formJson: { [key: string]: any }) {
//     console.log(formJson);
//     const { id, title, date: dateRaw } = formJson;

//     if (!(id && title && dateRaw)) {
//         throw new Error("Missing Data");
//     }
//     const date = dayjs(dateRaw, "DD.MM.YYYY HH:MM").toISOString();
//     const webinar: WebinarUpdate = {
//         id,
//         title,
//         date,
//     };
//     const response = await updateWebinar(webinar);
// }

// export async function createWebinar(props: WebinarNew) {
//     const customer = props;
//     const { data, errors } = await client.models.Webinar.create(customer);
//     if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
//     return data;
// }

// export async function updateWebinar(props: WebinarUpdate) {
//     const customer = props;
//     const { data, errors } = await client.models.Webinar.update(customer);
//     if (errors) throw new Error(errors.map((x) => x.message).join(";\n"));
//     return data;
// }
// export async function deleteWebinar(webinar: Webinar) {
//     if (!webinar.id) throw new Error("Missing Data");

//     const { errors } = await client.models.Webinar.delete({ id: webinar.id });
//     console.log(errors);
// }

//#endregion

//#region InfluencerAssignments
// export interface InfluencerAssignment {}
// export async function createInfluencerAssignment(params: type) {}
//#endregion
