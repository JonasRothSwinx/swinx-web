import { BulkEmailEntry, SendBulkEmailCommand } from "@aws-sdk/client-sesv2";
import { client } from "./client.js";
import { sesHandlerSendEmailTemplateBulk } from "./resource.js";

export async function sendEmailTemplateBulk(props: sesHandlerSendEmailTemplateBulk) {
    const {
        bulkEmailData: { from, emailData, templateName, defaultTemplateData },
    } = props;
    const response = await client.send(
        new SendBulkEmailCommand({
            BulkEmailEntries: emailData.map((entry) => {
                return {
                    Destination: {
                        ToAddresses: [entry.to],
                    },
                    ReplacementEmailContent: {
                        ReplacementTemplate: {
                            ReplacementTemplateData: entry.templateData,
                        },
                    },
                } satisfies BulkEmailEntry;
            }),
            FromEmailAddress: from,
            DefaultContent: {
                Template: {
                    TemplateName: templateName,
                    TemplateData: JSON.stringify(defaultTemplateData),
                },
            },
        }),
    );
    return response;
}
