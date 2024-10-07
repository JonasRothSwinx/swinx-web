"use server";

import { Amplify } from "aws-amplify";
import config from "@/amplify_outputs.json";
import { getPropertiesServer, getUrlServer, listServer } from "./serverRunner";

export async function configureAmplifyServer() {
    // console.log("configuring amplify server");
    Amplify.configure(config);
}

interface ListEventImages {
    campaignId: string;
    eventId: string;
}
export async function listEventImages({ campaignId, eventId }: ListEventImages) {
    // return [];
    console.log("listEventImages", { campaignId, eventId });
    try {
        const response = await listServer({ path: `test/${campaignId}/${eventId}/images` });

        console.log({ response });
        // return response;
        // const images = await Promise.all(
        //     response.items.filter(async (item) => {
        //         const properties = await getPropertiesServer({ path: item.path });
        //         return properties.contentType?.startsWith("image");
        //     }),
        // );
        const items = await Promise.all(
            response.items.map(async (item) => {
                const url = await getUrlServer({
                    path: item.path,
                });
                return { ...item, url: url.url.toString() };
            }),
        );
        console.log("currentImages", { eventId, items });
        return items;
    } catch (e) {
        console.log(e);
        return [];
    }
}
interface ListEventTexts {
    campaignId: string;
    eventId: string;
}

export async function listEventTexts({ campaignId, eventId }: ListEventTexts) {
    // return [];
    const response = await listServer({ path: `test/${campaignId}/${eventId}/` });
    const images = await Promise.all(
        response.items.filter(async (item) => {
            const properties = await getPropertiesServer({ path: item.path });
            return properties.contentType?.startsWith("text");
        }),
    );
    const items = await Promise.all(
        images.map(async (item) => {
            const url = await getUrlServer({
                path: item.path,
            });
            return { ...item, url };
        }),
    );
    console.log("currentFiles", { eventId, items });
    return items;
}
interface ListEventVideos {
    campaignId: string;
    eventId: string;
}
export async function listEventVideos({ campaignId, eventId }: ListEventVideos) {
    // return [];
    const response = await listServer({ path: `test/${campaignId}/${eventId}/` });
    const images = await Promise.all(
        response.items.filter(async (item) => {
            const properties = await getPropertiesServer({ path: item.path });
            return properties.contentType?.startsWith("video");
        }),
    );
    const items = await Promise.all(
        images.map(async (item) => {
            const url = await getUrlServer({
                path: item.path,
            });
            return { ...item, url };
        }),
    );
    console.log("currentFiles", { eventId, items });
    return items;
}
