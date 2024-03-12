import { ListEmailTemplatesCommand } from "@aws-sdk/client-sesv2";
import client from "./clients/SESclient.js";

export default async function listTemplates() {
    const response = await client.send(new ListEmailTemplatesCommand({}));
    return response.TemplatesMetadata;
}
