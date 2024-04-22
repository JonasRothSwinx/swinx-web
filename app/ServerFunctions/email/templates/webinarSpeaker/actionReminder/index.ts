import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { renderAsync } from "@react-email/render";
import WebinarSpeakerActionReminderMail from "./WebinarSpeakerDateReminder";

export type TemplateVariables = {
    name: string;
};

const templateBaseName = "WebinarSpeakerActionReminder";
const subjectLineBase = "Erinnerung: Webinar";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "new" })),
        text: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const defaultParams: TemplateVariables = {
    name: "testName",
};

const WebinarSpeakerActionReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default WebinarSpeakerActionReminder;

async function send(props: SendMailProps) {
    const {
        level,
        fromAdress,
        context: { eventWithInfluencer },
    } = props;
    if (!eventWithInfluencer) {
        throw new Error("Missing context");
    }
    if (level === "none") {
        return;
    }
    const templateName = WebinarSpeakerActionReminder.levels[level].name;
    const requestBody: sesHandlerSendEmailTemplateBulk = {
        operation: "sendEmailTemplateBulk",
        bulkEmailData: {
            from: fromAdress ?? "swinx GmbH <noreply@swinx.de>",
            templateName: templateName,
            defaultTemplateData: JSON.stringify(defaultParams),
            emailData: eventWithInfluencer.reduce((acc, [event, influencer]) => {
                if (!event.eventTaskAmount || event.eventTaskAmount === 0) return acc;
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: `${influencer.firstName} ${influencer.lastName}`,
                        } satisfies Partial<TemplateVariables>),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
