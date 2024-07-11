import { MailTemplate, Template } from "../types";
import { EmailTriggers } from "@/app/ServerFunctions/types";
import InvitesReminderMail from "./InvitesReminderMail";
import { renderAsync } from "@react-email/render";
import send from "./send";
import { defaultParams, subjectLineBase } from "./TemplateVariables";

import { templateNames as templateLevelNames } from "./TemplateVariables";

const templates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: MailTemplate } = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(InvitesReminderMail({ emailLevel: "new" })),
        text: renderAsync(InvitesReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
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
