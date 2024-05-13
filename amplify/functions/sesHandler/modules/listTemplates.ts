import {
    EmailTemplateMetadata,
    ListEmailTemplatesCommand,
    ListEmailTemplatesCommandOutput,
} from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function listTemplates() {
    const templates: EmailTemplateMetadata[] = [];
    let nextToken: string | undefined = undefined;
    do {
        const response: ListEmailTemplatesCommandOutput = await client.send(
            new ListEmailTemplatesCommand({ NextToken: nextToken })
        );
        nextToken = response.NextToken;
        templates.push(...(response.TemplatesMetadata ?? []));
    } while (nextToken);
    return templates;
}
