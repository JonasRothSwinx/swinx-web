import { MailTemplate, Template } from "../types";
import { EmailTriggers } from "@/app/ServerFunctions/types";
import InvitesReminderMail, { subjectLineBase, defaultParams } from "./InvitesReminderMail";
import { renderAsync } from "@react-email/render";
import send from "./send";

const templateBaseName = "InvitesReminder";

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
export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export const inviteReminderTemplates: Template = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
};
export default inviteReminderTemplates;
