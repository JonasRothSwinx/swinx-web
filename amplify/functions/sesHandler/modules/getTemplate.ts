import { GetEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function getTemplate(templateName: string) {
    if (templateName === "") {
        return "No template name provided";
    }
    const response = await client.send(new GetEmailTemplateCommand({ TemplateName: templateName }));
    return { ...response, $metadata: undefined };
}
