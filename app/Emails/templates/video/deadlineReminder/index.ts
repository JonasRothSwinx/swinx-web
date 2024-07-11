import { EmailLevelDefinition, MailTemplate, Template } from "../../types";
import VideoDraftDeadlineReminderEmail from "./VideoDraftDeadlineReminderEmail";
import { renderAsync } from "@react-email/render";
import send from "./send";
import {
    templateNames as templateLevelNames,
    subjectLineBase,
    defaultParams,
} from "./TemplateVariables";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" }), {
            plainText: true,
        }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "reduced" }), {
            plainText: true,
        }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export const PostReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default PostReminder;
