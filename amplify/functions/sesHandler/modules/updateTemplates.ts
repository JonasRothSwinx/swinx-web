import {
    ListEmailTemplatesCommand,
    UpdateEmailTemplateCommandInput,
    UpdateEmailTemplateCommand,
    CreateEmailTemplateCommand,
    EmailTemplateMetadata,
    ListEmailTemplatesCommandOutput,
} from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function updateTemplates(
    updateData: { name: string; subjectLine: string; html: string /* text: string  */ }[]
) {
    const messages: { error: unknown; template: (typeof updateData)[number] }[] = [];
    const templates: EmailTemplateMetadata[] = [];
    let nextToken: string | undefined = undefined;
    do {
        const response: ListEmailTemplatesCommandOutput = await client.send(
            new ListEmailTemplatesCommand({ NextToken: nextToken })
        );
        nextToken = response.NextToken;
        templates.push(...(response.TemplatesMetadata ?? []));
    } while (nextToken);

    console.log(`Found ${templates.length} templates`);

    const responses = await Promise.all(
        updateData.map((template) => {
            const content: UpdateEmailTemplateCommandInput = {
                TemplateName: template.name,
                TemplateContent: {
                    Subject: template.subjectLine,
                    Html: template.html,
                    // Text: template.text,
                },
            };
            try {
                if (templates?.find((x) => x.TemplateName === template.name)) {
                    console.log(`Updating template ${template.name} with content`, content);
                    return client.send(new UpdateEmailTemplateCommand(content));
                }
                console.log(`Creating template ${template.name} with content`, content);
                return client.send(new CreateEmailTemplateCommand(content));
            } catch (error) {
                console.error(error);
                messages.push({ error, template });
            }
        })
    );
    console.log(`Updated ${responses.length} templates`);
    console.log(responses);

    // const { TemplatesMetadata: newTemplates } = await client.send(new ListEmailTemplatesCommand({}));

    // messages.push(...(newTemplates ?? []));
    return messages;
}
