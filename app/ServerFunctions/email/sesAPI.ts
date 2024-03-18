import { sesHandlerEventBody } from "@/amplify/functions/sesHandler/types";
import config from "@/amplifyconfiguration.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiUrl = (config as any)?.custom?.sesHandlerUrl;

export function fetchApi(body: sesHandlerEventBody) {
    // console.log("fetching", apiUrl, body);
    console.log({ apiUrl, apikey: process.env.ADMIN_API_KEY });
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/json; charset=UTF-8",
            "x-api-key": process.env.ADMIN_API_KEY ?? "",
        },
        body: JSON.stringify(body),
    });
}
