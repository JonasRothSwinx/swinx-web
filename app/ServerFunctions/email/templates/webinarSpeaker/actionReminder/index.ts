import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { renderAsync } from "@react-email/render";
import WebinarSpeakerActionReminderMail, {
    subjectLineBase,
    defaultParams,
    TemplateVariables,
} from "./WebinarSpeakerDateReminder";
import ErrorLogger from "@/app/ServerFunctions/errorLog";
import dayjs from "@/app/utils/configuredDayJs";

const templateBaseName = "WebinarSpeakerActionReminder";

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

const WebinarSpeakerActionReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default WebinarSpeakerActionReminder;

async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
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
            emailData: individualContext.reduce((acc, { event, customer, influencer }) => {
                if (!event || !customer || !influencer) {
                    ErrorLogger.log("Missing context");
                    return acc;
                }
                const webinar = event.parentEvent as TimelineEvent.Event;
                if (!webinar || !webinar.date) {
                    ErrorLogger.log("Missing webinar context");
                    return acc;
                }
                const webinarTitle = webinar.eventTitle ?? "<Kein Webinartitel angegeben>";
                const topic = event.info?.topic ?? "<Kein Thema angegeben>";
                const time = dayjs(event.date).format("H:MM");

                const recipientName = `${influencer.firstName} ${influencer.lastName}`;

                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: `${influencer.firstName} ${influencer.lastName}`,
                            webinarTitle,
                            topic,
                            time,
                        } satisfies TemplateVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
