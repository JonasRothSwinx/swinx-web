"use server";
import getSESClient from "../client";
import {
    DeleteEmailTemplateCommand,
    DeleteEmailTemplateCommandOutput,
} from "@aws-sdk/client-sesv2";

interface DeleteTemplatesParams {
    templateNames: string[];
}
export default async function deleteTemplates({ templateNames }: DeleteTemplatesParams) {
    if (templateNames.length === 0) return;
    const client = await getSESClient();
    const responses: Promise<DeleteEmailTemplateCommandOutput>[] = [];

    for (const templateName of templateNames) {
        const command = new DeleteEmailTemplateCommand({
            TemplateName: templateName,
        });
        responses.push(client.send(command));
    }
    const response = await Promise.all(responses);
    return response;
}
