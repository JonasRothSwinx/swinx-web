import { EmailTriggers, Events } from "@/app/ServerFunctions/types/";
import { TriggerGroup } from "../types";
import getMailConfig from "./mailconfig";
import { sendMailBySender } from "./sendMailBySender";
import { SendBulkEmailResponse } from "@aws-sdk/client-sesv2";

interface HandleTriggerParams {
    triggers: TriggerGroup;
}
export default async function handleTriggers({ triggers }: HandleTriggerParams) {
    const mailConfig = await getMailConfig();
    console.log("Handling triggers");
    const tasks: Promise<SendBulkEmailResponse | void>[] = [];
    Object.entries(triggers).forEach(async ([eventTypeRaw, eventTriggers]) => {
        const eventType = eventTypeRaw as Events.eventType;
        // console.log("Handling event type", eventType);
        Object.entries(eventTriggers).forEach(async ([emailTypeRaw, emailTypeTriggers]) => {
            const emailType = emailTypeRaw as EmailTriggers.emailTriggerType;
            // console.log("Handling email type", emailType);
            Object.entries(emailTypeTriggers).forEach(async ([emailLevelRaw, triggers]) => {
                const emailLevel = emailLevelRaw as EmailTriggers.emailLevel;
                const sendFunction = mailConfig[eventType][emailType];
                if (!sendFunction) {
                    console.error("No send function found for", eventType, emailType);
                    return;
                }
                console.log("Sending", eventType, emailType, emailLevel);
                tasks.push(
                    ...(await sendMailBySender({
                        triggers,
                        level: emailLevel,
                        send: sendFunction,
                    })),
                );
            });
        });
    });
    return tasks;
}
