import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import VideoDraftDeadlineReminderEmail, {
    TemplateVariables,
    defaultParams,
    subjectLineBase,
} from "./VideoDraftDeadlineReminderEmail";
import { renderAsync } from "@react-email/render";
import ErrorLogger from "@/app/ServerFunctions/errorLog";

const templateBaseName = "VideoDraftDeadlineReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;

export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const PostReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default PostReminder;

async function send(props: SendMailProps) {
    const { level, fromAdress, individualContext } = props;
    if (level === "none") {
        return;
    }
    const templateName = PostReminder.levels[level].name;
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
                const recipientName = `${influencer.firstName} ${influencer.lastName}`;
                const customerName = `${customer.firstName} ${customer.lastName}`;
                const topic = event.info?.topic ?? "Kein Thema gefunden";
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: recipientName,
                            customerName,
                            topic,
                        } satisfies TemplateVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
