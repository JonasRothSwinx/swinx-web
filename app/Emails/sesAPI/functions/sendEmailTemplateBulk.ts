"use server";
import * as SesHandlerTypes from "@/amplify/functions/sesHandler/types";
import getSESClient from "../client";
import { BulkEmailEntry, SendBulkEmailCommand } from "@aws-sdk/client-sesv2";

interface SendEmailTemplateBulkParams {
    from: string;
    templateName: string;
    defaultTemplateData: string;
    bulkTemplateData: {
        to: string;
        templateData: string;
    }[];
}
/**
 * Send an email using a personalized template to multiple recipients
 * @param from - email address to send from
 * @param templateName - name of the template to use
 * @param defaultTemplateData - data to use in the template
 * @param bulkTemplateData - array of objects containing the email address and personalized template data
 * @returns response from the SES API
 */
export default async function sendEmailTemplateBulk({
    from,
    templateName,
    defaultTemplateData,
    bulkTemplateData,
}: SendEmailTemplateBulkParams) {
    const client = await getSESClient();
    const bcc = from.includes("noreply") ? [] : [from];
    const bulkEntries: BulkEmailEntry[] = bulkTemplateData.map((entry) => {
        return {
            Destination: {
                ToAddresses: [entry.to],
                BccAddresses: bcc,
            },
            ReplacementEmailContent: {
                ReplacementTemplate: {
                    ReplacementTemplateData: entry.templateData,
                },
            },
        };
    });
    const command = new SendBulkEmailCommand({
        BulkEmailEntries: bulkEntries,
        FromEmailAddress: from,
        DefaultContent: {
            Template: {
                TemplateName: templateName,
                TemplateData: defaultTemplateData,
            },
        },
        ConfigurationSetName: "Default",
    });
    const response = await client.send(command);
    return response;
}
