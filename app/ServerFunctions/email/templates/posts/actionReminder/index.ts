import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../../sesAPI";
import { EmailLevelDefinition, SendMailProps, Template } from "../../types";
import PostActionReminderMail, { subjectLineBase, TemplateVariables, defaultParams } from "./PostActionReminderMail";
import { renderAsync } from "@react-email/render";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";

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
    const {
        level,
        fromAdress,
        context: { eventWithInfluencer, customer },
    } = props;
    if (!eventWithInfluencer || !customer) {
        throw new Error("Missing context");
    }
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
            emailData: eventWithInfluencer.reduce((acc, [event, influencer]) => {
                if (!event.eventTaskAmount || event.eventTaskAmount === 0) return acc;
                const postTimeObject = dayjs(event.date);
                const postTime = postTimeObject.format("H:MM");
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
