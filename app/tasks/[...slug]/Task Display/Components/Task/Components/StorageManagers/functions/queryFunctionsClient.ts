import { Prettify } from "@/app/Definitions/types";
import { getProperties, getUrl, list } from "aws-amplify/storage";

export type ListEventFilesOutput = ReturnType<typeof listEventImages>;
interface ListEventFiles {
    campaignId: string;
    eventId: string;
}
export async function listEventImages({ campaignId, eventId }: ListEventFiles) {
    // return [];
    console.log("listEventImages", { campaignId, eventId });
    try {
        const response = await list({ path: `test/${campaignId}/${eventId}/images/` });

        console.log({ response });
        // return response;
        // const images = await Promise.all(
        //     response.items.filter(async (item) => {
        //         const properties = await getProperties({ path: item.path });
        //         return properties.contentType?.startsWith("image");
        //     }),
        // );
        const items = await Promise.all(
            response.items.map(async (item) => {
                const url = await getUrl({
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

export async function listEventTexts({ campaignId, eventId }: ListEventFiles) {
    // return [];
    const response = await list({ path: `test/${campaignId}/${eventId}/text/` });
    const items = await Promise.all(
        response.items.map(async (item) => {
            return { ...item, url: "" };
        }),
    );
    console.log("currentTexts", { eventId, items });
    return items;
}

export async function listEventVideos({ campaignId, eventId }: ListEventFiles) {
    // return [];
    const response = await list({ path: `test/${campaignId}/${eventId}/video/` });
    const items = await Promise.all(
        response.items.map(async (item) => {
            const url = await getUrl({
                path: item.path,
            });
            return { ...item, url: url.url.toString() };
        }),
    );
    console.log("currentVideos", { eventId, items });
    return items;
}
