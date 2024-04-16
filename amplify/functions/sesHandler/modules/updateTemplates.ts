import {
    ListEmailTemplatesCommand,
    UpdateEmailTemplateCommandInput,
    UpdateEmailTemplateCommand,
    CreateEmailTemplateCommand,
} from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function updateTemplates(
    updateData: { name: string; subjectLine: string; html: string }[],
) {
    const messages = [];
    const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));

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

            if (templates?.find((x) => x.TemplateName === template.name)) {
                return client.send(new UpdateEmailTemplateCommand(content));
            }
            return client.send(new CreateEmailTemplateCommand(content));
        }),
    );

    const { TemplatesMetadata: newTemplates } = await client.send(
        new ListEmailTemplatesCommand({}),
    );
    messages.push(...(newTemplates ?? []));
    return messages;
}
