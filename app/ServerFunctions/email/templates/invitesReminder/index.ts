import { MailTemplate, SendMailProps, Template } from "../types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { sesHandlerSendEmailTemplateBulk } from "@/amplify/functions/sesHandler/types";
import sesAPIClient from "../../sesAPI";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import InvitesReminderMail from "./InvitesReminderMail";
import { renderAsync } from "@react-email/render";

export type TemplateVariables = {
    name: string;
    inviteAmount: string;
};

const templateBaseName = "InvitesReminder";
const subjectLineBase = "Erinnerung: Einladungen";

const templates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: MailTemplate } = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(InvitesReminderMail({ emailLevel: "new" })),
        text: renderAsync(InvitesReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(InvitesReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(InvitesReminderMail({ emailLevel: "reduced" }), { plainText: true }),
    },
} as const;
export const templateNames = [...Object.values(templates).map((template) => template.name)] as const;

const defaultParams: TemplateVariables = {
    name: "testName",
    inviteAmount: "0",
};

const inviteReminderTemplates: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
};
export default inviteReminderTemplates;

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
    const templateName = inviteReminderTemplates.levels[level].name;
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
                            inviteAmount: event.eventTaskAmount.toString(),
                        } satisfies Partial<TemplateVariables>),
                    },
                ];
            }, [] as { to: string; templateData: string }[]),
        },
    };
    const response = await sesAPIClient.sendBulk(requestBody);
    return response;
}
