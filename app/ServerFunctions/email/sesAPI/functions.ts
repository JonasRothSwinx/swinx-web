"use server";

import * as SesHandlerTypes from "@/amplify/functions/sesHandler/types";
import config from "@/amplifyconfiguration.json";
import templateDefinitions, { templateName } from "../templates";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiUrl = (config as any)?.custom?.sesHandlerUrl;

export async function sendRequest(
    body: SesHandlerTypes.sesHandlerEventBody,
): Promise<SesHandlerTypes.sesHandlerResponse> {
    const apiKey = process.env.ADMIN_API_KEY;
    if (!apiKey) {
        throw new Error("No API Key found");
    }
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "text/json; charset=UTF-8",
            "x-api-key": apiKey,
        },
        body: JSON.stringify(body),
    });
    const responseJson: SesHandlerTypes.sesHandlerResponse = await response.json();
    return responseJson;
}
//#region email operations
export async function sendEmailTemplate(body: SesHandlerTypes.sesHandlerSendEmailTemplate) {
    const response = await sendRequest(body);
    return response;
}

export async function sendEmailTemplateBulk(body: SesHandlerTypes.sesHandlerSendEmailTemplateBulk) {
    const response = (await sendRequest(
        body,
    )) as SesHandlerTypes.sesHandlerSendEmailTemplateBulkResponseBody;
    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }
    return response.responseData;
}
//#endregion

//#region template operations
export async function listTemplates() {
    const requestBody: SesHandlerTypes.sesHandlerListTemplate = {
        operation: "list",
    };
    const response = await sendRequest(requestBody);
    return response;
}

export async function updateTemplates(templateNames: templateName[] = []) {
    const updateData: SesHandlerTypes.sesHandlerUpdateTemplate["updateData"] = Object.entries(
        templateDefinitions.mailTypes,
    ).reduce((acc, [key, template]) => {
        const newData = Object.entries(template.levels).reduce((acc, [level, levelData]) => {
            if (templateNames.length && !templateNames.includes(key)) return acc;
            return [...acc, levelData];
        }, acc);
        return [...acc, ...newData];
    }, [] as typeof updateData);

    const requestBody: SesHandlerTypes.sesHandlerUpdateTemplate = {
        operation: "update",
        updateData,
    };
    const response = (await sendRequest(
        requestBody,
    )) as SesHandlerTypes.sesHandlerUpdateTemplateResponseBody; //TODO: validation
    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }
    console.log(response);
    return response;
}

export async function getTemplate(templateName: string) {
    const requestBody: SesHandlerTypes.sesHandlerGetTemplate = {
        operation: "get",
        templateName,
    };
    const response = (await sendRequest(
        requestBody,
    )) as SesHandlerTypes.sesHandlerGetTemplateResponseBody; //TODO validation;
    if (response.error) {
        throw new Error(JSON.stringify(response.error));
    }

    return response.responseData;
}

export async function deleteTemplates(
    deleteData: SesHandlerTypes.sesHandlerDeleteTemplate["deleteData"],
) {
    const requestBody: SesHandlerTypes.sesHandlerDeleteTemplate = {
        operation: "delete",
        deleteData,
    };
    const response = await sendRequest(requestBody);
    return response;
}
//#endregion
