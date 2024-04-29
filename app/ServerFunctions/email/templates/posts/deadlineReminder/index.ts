import { EmailLevelDefinition, MailTemplate, SendMailProps, Template } from "../../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import PostDraftDeadlineReminderEmail, {
    subjectLineBase,
    defaultParams,
    TemplateVariables,
} from "./PostDeadlineReminderEmail";
import { renderAsync } from "@react-email/render";
import ErrorLogger from "@/app/ServerFunctions/errorLog";

const templateBaseName = "PostDraftDeadlineReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "reduced" }), { plainText: true }),
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

type personalVariables = Pick<TemplateVariables, "name" | "customerName" | "topic">;
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
            emailData: individualContext.reduce((acc, { event, customer, influencer }) => {
                if (!event || !customer || !influencer) {
                    ErrorLogger.log("Missing context");
                    return acc;
                }
                const recipientName = `${influencer.firstName} ${influencer.lastName}`;
                const customerName = `${customer.firstName} ${customer.lastName}`;
                const topic = event.info?.topic ?? "<Kein Thema angegeben>";
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: recipientName,
                            customerName,
                            topic,
                        } satisfies personalVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
