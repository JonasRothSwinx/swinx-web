import { DeleteEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function deleteTemplate(templateName: string) {
    if (templateName === "") {
        return "No template name provided";
    }
    console.log(`Deleting template ${templateName}`);
    const response = await client.send(new DeleteEmailTemplateCommand({ TemplateName: templateName }));
    console.log(`Deleted template ${templateName}`);
    console.log("response:", response);
    return { ...response, $metadata: undefined };
}
