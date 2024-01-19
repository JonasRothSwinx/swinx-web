"use server";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "./amplifyServerUtils";
import { cookies } from "next/headers";
import config from "@/amplifyconfiguration.json";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

// export default { getUserGroups, getUserAttributes };
const client = generateServerClientUsingCookies<Schema>({ config, cookies });

export async function getUserGroups() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            const session = await fetchAuthSession(contextSpec);
            // console.log(session);
            const payloadGroups =
                (session.tokens?.accessToken.payload["cognito:groups"] as string[]) ?? [];
            // console.log(typeof payloadGroups);
            // if (!payloadGroups || typeof payloadGroups !== Json[]) return [];
            console.log(payloadGroups);
            return payloadGroups;
            return [];
        },
    });
    return result;
}
export async function getUserAttributes() {
    const result = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            const attributes = await fetchUserAttributes(contextSpec);
            return attributes;
        },
    });
    return result;
}
interface InfluencerDataNew {
    firstName: string;
    lastName: string;
    email: string;
}
interface InfluencerDataUpdate extends InfluencerDataNew {
    id: string;
}

export async function createNewInfluencer(props: { data: InfluencerDataNew }): Promise<void> {
    const { firstName, lastName, email } = props.data;
    console.log({ firstName, lastName, email });
    if (!(firstName && lastName && email)) {
        return;
    }
    const { data: privateData, errors: errors2 } = await client.models.InfluencerPrivate.create({
        email,
    });
    const { data: publicData } = await client.models.InfluencerPublic.create({
        firstName,
        lastName,
        details: privateData,
    });
}
export async function updateInfluencer(props: { data: InfluencerDataUpdate }): Promise<void> {
    const { id, firstName, lastName, email } = props.data;
    console.log({ firstName, lastName, email });
    if (!(firstName && lastName && email)) {
        return;
    }
    const { data: privateData, errors: errorsPrivate } =
        await client.models.InfluencerPrivate.update({
            id,
            email,
        });
    const { data: publicData, errors: errorsPublic } = await client.models.InfluencerPublic.update({
        id,
        firstName,
        lastName,
        details: privateData,
    });
}
export async function deleteInfluencer(props: {
    publicId: string;
    privateId: string;
}): Promise<void> {
    const { publicId, privateId } = props;
    console.log({ publicId, privateId });
    if (!(publicId && privateId)) {
        return;
    }
    const { data: privateData, errors: errorsPrivate } =
        await client.models.InfluencerPrivate.delete({
            id: privateId,
        });
    console.log({ privateData, errorsPrivate });
    const { data: publicData, errors: errorsPublic } = await client.models.InfluencerPublic.delete({
        id: publicId,
    });
    console.log({ publicData, errorsPublic });
}
