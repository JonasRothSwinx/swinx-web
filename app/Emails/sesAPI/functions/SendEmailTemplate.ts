"use server";
import getSESClient from "../client";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";

//#region email operations
interface SendEmailTemplateParams {
    to: string[];
    from: string;
    templateName: string;
    templateData: string;
}
/**
 * Send an email using a template
 * @param to - email addresses to send to
 * @param from - email address to send from
 * @param templateName - name of the template to use
 * @param templateData - data to use in the template
 * @returns response from the SES API
 */
export default async function sendEmailTemplate({
    to,
    from,
    templateName,
    templateData,
}: SendEmailTemplateParams) {
    const client = await getSESClient();
    const bcc = from.includes("noreply") ? [] : [from];
    const Command = new SendEmailCommand({
        Destination: {
            ToAddresses: to,
            BccAddresses: bcc,
        },
        FromEmailAddress: from,
        Content: {
            Template: {
                TemplateName: templateName,
                TemplateData: templateData,
            },
        },
        ConfigurationSetName: "Default",
    });
    const response = await client.send(Command);
    return response;
}
