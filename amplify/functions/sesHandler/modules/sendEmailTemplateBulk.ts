import { BulkEmailEntry, SendBulkEmailCommand } from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";
import { sesHandlerSendEmailTemplateBulk } from "../types.js";

export default async function sendEmailTemplateBulk(props: sesHandlerSendEmailTemplateBulk) {
    const {
        bulkEmailData: { from, emailData, templateName, defaultTemplateData },
    } = props;
    console.log("Sending bulk email", props, emailData);
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
                    TemplateData: defaultTemplateData,
                },
            },
            ConfigurationSetName: "Default",
        })
    );
    return response;
}
