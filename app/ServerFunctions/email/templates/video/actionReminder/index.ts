import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import VideoPublishReminderEmail from "./VideoActionReminderEmail";
import { renderAsync } from "@react-email/render";

export type TemplateVariables = {
    name: string;
};
const templateBaseName = "VideoReminder";
const subjectLineBase = "Erinnerung: Beitragsveröffentlichung";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoPublishReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(VideoPublishReminderEmail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const defaultParams: TemplateVariables = {
    name: "testName",
};

const VideoReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default VideoReminder;

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
    const templateName = VideoReminder.levels[level].name;
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
