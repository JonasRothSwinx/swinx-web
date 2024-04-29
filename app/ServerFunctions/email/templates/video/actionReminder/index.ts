import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import VideoPublishReminderEmail, {
    TemplateVariables,
    defaultParams,
    subjectLineBase,
} from "./VideoActionReminderEmail";
import { renderAsync } from "@react-email/render";
import dayjs from "@/app/utils/configuredDayJs";
import ErrorLogger from "@/app/ServerFunctions/errorLog";

const templateBaseName = "VideoReminder";

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

const VideoReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default VideoReminder;

async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
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
            emailData: individualContext.reduce((acc, { event, influencer, customer }) => {
                if (!event || !influencer || !customer) {
                    ErrorLogger.log("Missing context");
                    return acc;
                }
                const postTime = dayjs(event.date).format("H:MM");
                const recipientName = `${influencer.firstName} ${influencer.lastName}`;
                const customerName = `${customer.firstName} ${customer.lastName}`;
                const customerLink = customer.profileLink ?? "<No profile link found>";
                const postContent = event.info?.eventPostContent ?? "<No post content found>";
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: recipientName,
                            customerName,
                            customerLink,
                            postContent,
                            postTime,
                        } satisfies TemplateVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
