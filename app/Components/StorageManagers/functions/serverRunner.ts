"use server";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "@/amplify_outputs.json";
import { getProperties, getUrl, list } from "aws-amplify/storage/server";

const { runWithAmplifyServerContext } = createServerRunner({
    config: outputs,
});

interface ListServer {
    path: string;
}
export async function listServer({ path }: ListServer) {
    console.log("listServer", { path });
    try {
        const response = await runWithAmplifyServerContext({
            nextServerContext: null,
            operation: (contextSpec) => list(contextSpec, { path }),
        });
        console.log("listStorage", { response, path });
        return response;
    } catch (error) {
        console.log("Error in listStorage", { error, path });
        return { items: [] };
    }
}

interface GetPropertiesStorage {
    path: string;
}
export async function getPropertiesServer({ path }: GetPropertiesStorage) {
    console.log("getPropertiesServer", { path });
    try {
        const response = await runWithAmplifyServerContext({
            nextServerContext: null,
            operation: (contextSpec) => getProperties(contextSpec, { path }),
        });
        return response;
    } catch (error) {
        console.log("Error in getPropertiesStorage", { error, path });
        throw error;
    }
}

interface GetUrlStorage {
    path: string;
}
export async function getUrlServer({ path }: GetUrlStorage) {
    console.log("getUrlServer", { path });
    try {
        const response = await runWithAmplifyServerContext({
            nextServerContext: null,
            operation: (contextSpec) => getUrl(contextSpec, { path }),
        });
        return response;
    } catch (error) {
        console.log("Error in getUrlStorage", { error, path });
        throw error;
    }
}
