"use server";
import * as SesHandlerTypes from "@/amplify/functions/sesHandler/types";
import templateDefinitions, { templateName } from "../../templates";
import { sleep } from "@/app/utils";
import { Prettify } from "@/app/Definitions/types";
import getSESClient from "../client";
import {
    CreateEmailTemplateCommand,
    CreateEmailTemplateCommandOutput,
    UpdateEmailTemplateCommand,
    UpdateEmailTemplateCommandOutput,
} from "@aws-sdk/client-sesv2";
import listTemplates from "./listTemplates";
import { SESError } from "../types";

type updateDataWithPromises = Prettify<
    Omit<SesHandlerTypes.sesHandlerUpdateTemplate["updateData"][number], "html" | "text"> & {
        html: string | Promise<string>;
    }
>[];
type updateDataResolved = Prettify<
    SesHandlerTypes.sesHandlerUpdateTemplate["updateData"][number]
>[];
type updateData = {
    name: string;
    subjectLine: string;
    html: string | Promise<string>;
    text: string | Promise<string>;
};

export default async function updateTemplates(templateNames: templateName[] = []) {
    const entries = Object.entries(templateDefinitions.mailTypesFlat);
    const updateData: updateData[] = entries.reduce((acc, [key, template]) => {
        const levels = template.levels;
        const newTemplates = Object.entries(levels).map(([level, template]) => {
            return template;
        });

        newTemplates.filter((template) => !templateNames.includes(template.name as templateName));
        acc = [...acc, ...newTemplates];
        return acc;
    }, [] as updateData[]);
    // const updateData: updateDataResolved = await Promise.all(
    //     updateDataWithPromises.map(async (template) => {
    //         const [html /* , text */] = await Promise.all([template.html /* , template.text */]);

    //         return { ...template, html };
    //     }),
    // );
    // const client = await getSESClient();
    const existingTemplateNames = (await listTemplates())
        .map((template) => template.TemplateName)
        .filter((templateName): templateName is string => typeof templateName === "string");
    let responses: (CreateEmailTemplateCommandOutput | UpdateEmailTemplateCommandOutput)[] = [];
    let processed = 0;
    const total = updateData.length;
    console.log(updateData);
    while (updateData.length > 0) {
        const chunk = updateData.splice(0, 1);
        for (let attempts = 0; attempts < 10; attempts++) {
            try {
                const response = await processTemplate({
                    template: chunk[0],
                    existingTemplateNames,
                });
                if (!response) continue;
                // console.log(response);
                responses = [...responses, response];
                processed += chunk.length;
                console.log(`Updated ${processed} of ${total} templates`);
                break;
            } catch (error) {
                const sesError = error as SESError;
                if (sesError.$metadata?.httpStatusCode === 429) {
                    console.log("Rate limited, waiting 1 second");
                    await sleep(1000);
                } else {
                    console.error(error);
                    throw error;
                }
            }
        }
        // await sleep(100);
    }
    // console.log(responses);
    return responses;
    // return response;
}
interface ProcessTemplateParams {
    template: updateData;
    existingTemplateNames: string[];
}
async function processTemplate({ template, existingTemplateNames }: ProcessTemplateParams) {
    try {
        const client = await getSESClient();
        const { name, subjectLine, html, text } = template;
        const htmlString = await html;
        const textString = await text;
        let command: UpdateEmailTemplateCommand | CreateEmailTemplateCommand;
        if (existingTemplateNames.includes(name)) {
            //update
            command = new UpdateEmailTemplateCommand({
                TemplateName: name,
                TemplateContent: {
                    // Html: fixHrefPlaceholders(htmlString),
                    Html: htmlString,
                    Subject: subjectLine,
                    Text: textString,
                },
            });
        } else {
            //create
            command = new CreateEmailTemplateCommand({
                TemplateName: name,
                TemplateContent: {
                    // Html: fixHrefPlaceholders(htmlString),
                    Html: htmlString,
                    Subject: subjectLine,
                    Text: textString,
                },
            });
        }
        try {
            const response = await client.send(command);
            return response;
        } catch (error) {
            const sesError = error as SESError;
            if (!(sesError.$metadata?.httpStatusCode === 429)) {
                console.error(error);
            }
            throw error;
        }
    } catch (error) {
        const sesError = error as SESError;
        if (sesError.$metadata?.httpStatusCode === 429) {
            throw error;
        } else {
            console.log("---------------------");
            console.log("Processing Failed for template", template.name);
            console.log({
                error: error,
                template: template.name,
                subjectLine: template.subjectLine,
                html: await template.html,
                text: await template.text,
            });
            console.log("---------------------");
            throw error;
        }
    }
}

function fixHrefPlaceholders(html: string) {
    //replace
    return html.replace(/{{\s*href\s*}}/g, "{{= href }}");
}
