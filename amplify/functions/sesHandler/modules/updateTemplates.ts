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
    updateData: { name: string; subjectLine: string; html: string }[],
) {
    const messages = [];
    const templates: EmailTemplateMetadata[] = [];
    let nextToken: string | undefined = undefined;
    do {
        const response: ListEmailTemplatesCommandOutput = await client.send(
            new ListEmailTemplatesCommand({ NextToken: nextToken }),
        );
        nextToken = response.NextToken;
        templates.push(...(response.TemplatesMetadata ?? []));
    } while (nextToken);

    console.log(`Found ${templates.length} templates`);

    await Promise.all(
        updateData.map((template) => {
            const content: UpdateEmailTemplateCommandInput = {
                TemplateName: template.name,
                TemplateContent: {
                    Subject: template.subjectLine,
                    Html: template.html,
                    // Text: compiledHtmlConvert(template.html),
                },
            };
            try {
                if (templates?.find((x) => x.TemplateName === template.name)) {
                    return client.send(new UpdateEmailTemplateCommand(content));
                }
                return client.send(new CreateEmailTemplateCommand(content));
            } catch (error) {
                console.error(error);
                messages.push({ error, template });
            }
        }),
    );

    const { TemplatesMetadata: newTemplates } = await client.send(
        new ListEmailTemplatesCommand({}),
    );
    messages.push(...(newTemplates ?? []));
    return messages;
}
