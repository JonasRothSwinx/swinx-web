"use server";
// import client from "./sesClient";
import {
    CreateEmailTemplateCommand,
    DeleteEmailTemplateCommand,
    GetEmailTemplateCommand,
    ListEmailTemplatesCommand,
    TestRenderEmailTemplateCommand,
    UpdateEmailTemplateCommand,
    UpdateEmailTemplateCommandInput,
} from "@aws-sdk/client-sesv2";
import { compile } from "html-to-text";
import { SESv2Client } from "@aws-sdk/client-sesv2";
import templateDefinitions from "./templates";

const client = new SESv2Client({
    region: "eu-west-1",
});

const compiledHtmlConvert = compile({ wordwrap: 130 });

export async function updateTemplates() {
    const messages = [];
    const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));

    await Promise.all(
        templateDefinitions.map((template) => {
            const content: UpdateEmailTemplateCommandInput = {
                TemplateName: template.name,
                TemplateContent: {
                    Subject: template.subjectLine,
                    Html: template.html,
                    Text: compiledHtmlConvert(template.html),
                },
            };

            if (templates?.find((x) => x.TemplateName === template.name)) {
                return client.send(new UpdateEmailTemplateCommand(content));
            }
            return client.send(new CreateEmailTemplateCommand(content));
        }),
    );

    messages.push(templates);
    // console.log(messages, templates)
    return messages;
}

export async function deleteTemplates() {
    const messages = [];
    const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));
    if (templates) {
        await Promise.all(
            templates?.map(async (template) => {
                return client.send(
                    new DeleteEmailTemplateCommand({ TemplateName: template.TemplateName }),
                );
            }),
        );
    }
}
export async function listTemplates() {
    const messages = [];
    const { TemplatesMetadata: templates } = await client.send(new ListEmailTemplatesCommand({}));
    return templates;
}

export async function getTemplate(templateName: string) {
    await updateTemplates();
    const template = await client.send(new GetEmailTemplateCommand({ TemplateName: templateName }));
    return template;
}
export async function testRenderTemplate(
    templateName: string,
    templateData: Record<string, string>,
) {
    const response = await client.send(
        new TestRenderEmailTemplateCommand({
            TemplateName: templateName,
            TemplateData: JSON.stringify(templateData),
        }),
    );
    return response;
}
