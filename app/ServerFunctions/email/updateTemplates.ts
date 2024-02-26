"use Server";
import invitesHtml from "./templates/invitesTemplate";
import client from "./sesClient";
import { ListTemplatesCommand } from "@aws-sdk/client-ses";

export default function updateTemplates() {
    const messages = [];
    messages.push(invitesHtml);
    const templates = client.send(new ListTemplatesCommand({}));
    messages.push(templates);

    return messages;
}
