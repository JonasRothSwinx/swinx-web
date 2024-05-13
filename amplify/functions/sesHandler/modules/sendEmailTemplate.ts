import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { sesHandlerSendEmailTemplate } from "../types.js";
import client from "./clients/SESclient.js";

export default async function sendEmailTemplate(props: sesHandlerSendEmailTemplate) {
    const { to, from, templateName, templateData } = props.emailData;
    console.log({ to, from, templateName, templateData });
    const response = await client.send(
        new SendEmailCommand({
            Destination: {
                ToAddresses: to,
            },
            FromEmailAddress: from,
            Content: {
                Template: {
                    TemplateName: templateName,
                    TemplateData: templateData,
                },
            },
            ConfigurationSetName: "Default",
        })
    );
    return response;
}
