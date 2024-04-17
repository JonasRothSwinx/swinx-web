"use server";

import * as SesHandlerTypes from "@/amplify/functions/sesHandler/types";
import config from "@/amplifyconfiguration.json";
import templateDefinitions, { templateName } from "../templates";
import dotenv from "dotenv";
import sleep from "@/app/utils/sleep";
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
    const entries = Object.entries(templateDefinitions.mailTypes);
    const updateData: SesHandlerTypes.sesHandlerUpdateTemplate["updateData"] = entries.reduce(
        (acc, [key, template]) => {
            const levels = template.levels;
            const newTemplates = Object.entries(levels).map(([level, template]) => {
                return template;
            });
            newTemplates.filter(
                (template) => !templateNames.includes(template.name as templateName),
            );
            acc = [...acc, ...newTemplates];
            return acc;
        },
        [] as typeof updateData,
    );

    const responses = [];
    let processed = 0;
    const total = updateData.length;
    while (updateData.length > 0) {
        const chunk = updateData.splice(0, 5);
        const requestBody: SesHandlerTypes.sesHandlerUpdateTemplate = {
            operation: "update",
            updateData: chunk,
        };
        for (let attempts = 0; attempts < 10; attempts++) {
            const response = (await sendRequest(
                requestBody,
            )) as SesHandlerTypes.sesHandlerUpdateTemplateResponseBody; //TODO: validation
            if (response.error) {
                if (attempts === 10) {
                    throw new Error(JSON.stringify(response.error));
                }
                console.log(`Error updating templates attempt ${attempts}`, response.error);
                await sleep(1000);
                continue;
            }
            responses.push(response);
            processed += chunk.length;
            console.log(`Updated ${processed} of ${total} templates`);
            break;
        }
        await sleep(200);
    }
    console.log(responses);
    return responses;
    // return response;
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
