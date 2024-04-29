import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { EmailLevelDefinition, SendMailProps, Template } from "../../types";
import PostActionReminderMail, { subjectLineBase, TemplateVariables, defaultParams } from "./PostActionReminderMail";
import { renderAsync } from "@react-email/render";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import ErrorLogger from "@/app/ServerFunctions/errorLog";

const templateBaseName = "PostReminder";
const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostActionReminderMail({ emailLevel: "new" })),
        text: renderAsync(PostActionReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostActionReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(PostActionReminderMail({ emailLevel: "reduced" }), { plainText: true }),
    },
};

export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const PostReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default PostReminder;

type personalVariables = Pick<
    TemplateVariables,
    "name" | "postTime" | "customerName" | "customerProfileLink" | "postContent"
>;
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
                const postTime = dayjs(event.date).format("H:MM");
                const { company: customerName, profileLink: customerProfileLink } = customer;
                const postContent = event.info?.eventPostContent ?? "Kein Postinhalt gefunden";
                return [
                    ...acc,
                    {
                        to: influencer.email,
                        templateData: JSON.stringify({
                            name: `${influencer.firstName} ${influencer.lastName}`,
                            postTime,
                            customerName,
                            customerProfileLink: customerProfileLink ?? "Invalid",
                            postContent,
                        } satisfies personalVariables),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
