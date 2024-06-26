"use server";

import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { TriggerGroup } from "../types";
import getMailConfig from "./mailconfig";
import sendMailBySender from "./sendMailBySender";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

interface HandleTriggerParams {
    triggers: TriggerGroup;
}
export default async function handleTriggers({ triggers }: HandleTriggerParams) {
    const mailConfig = await getMailConfig();
    console.log("Handling triggers");
    Object.entries(triggers).forEach(([eventTypeRaw, eventTriggers]) => {
        const eventType = eventTypeRaw as TimelineEvent.eventType;
        console.log("Handling event type", eventType);
        Object.entries(eventTriggers).forEach(([emailTypeRaw, emailTypeTriggers]) => {
            const emailType = emailTypeRaw as EmailTriggers.emailTriggerType;
            console.log("Handling email type", emailType);
            Object.entries(emailTypeTriggers).forEach(async ([emailLevelRaw, triggers]) => {
                const emailLevel = emailLevelRaw as EmailTriggers.emailLevel;
                const sendFunction = mailConfig[eventType][emailType];
                if (!sendFunction) {
                    console.error("No send function found for", eventType, emailType);
                    return;
                }
                console.log("Sending", eventType, emailType, emailLevel);
                await sendMailBySender({ triggers, level: emailLevel, send: sendFunction });
            });
        });
    });
}
