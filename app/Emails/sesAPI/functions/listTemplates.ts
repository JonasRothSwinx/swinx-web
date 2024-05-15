"use server";
import getSESClient from "../client";
import {
    EmailTemplateMetadata,
    ListEmailTemplatesCommand,
    ListEmailTemplatesCommandOutput,
} from "@aws-sdk/client-sesv2";

//#endregion
//MARK: List Templates
export default async function listTemplates() {
    const client = await getSESClient();

    const templates: EmailTemplateMetadata[] = [];
    let nextToken: string | undefined = undefined;
    do {
        const response: ListEmailTemplatesCommandOutput = await client.send(
            new ListEmailTemplatesCommand({ NextToken: nextToken }),
        );
        nextToken = response.NextToken;
        templates.push(...(response.TemplatesMetadata ?? []));
    } while (nextToken);

    return templates;
}
