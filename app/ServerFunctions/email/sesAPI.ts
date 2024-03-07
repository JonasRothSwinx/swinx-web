import { sesHandlerEventBody } from "@/amplify/functions/sesHandler/resource";
import config from "@/amplifyconfiguration.json";
const apiUrl = (config as any)?.custom?.sesHandlerUrl;

export function fetchApi(body: sesHandlerEventBody) {
    // console.log("fetching", apiUrl, body);
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/json; charset=UTF-8",
            "x-api-key": process.env.ADMIN_API_KEY ?? "",
        },
        body: JSON.stringify(body),
    });
}
