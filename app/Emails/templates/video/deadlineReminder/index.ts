import { EmailLevelDefinition, MailTemplate, Template } from "../../types";
import VideoDraftDeadlineReminderEmail, {
    subjectLineBase,
    defaultParams,
} from "./VideoDraftDeadlineReminderEmail";
import { renderAsync } from "@react-email/render";
import send from "./send";

const templateBaseName = "VideoDraftDeadlineReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoDraftDeadlineReminderEmail({ emailLevel: "new" }), {
            plainText: true,
        }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
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
