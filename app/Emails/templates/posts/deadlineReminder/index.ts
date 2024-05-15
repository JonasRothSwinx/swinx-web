import { EmailLevelDefinition, Template } from "../../types";
import PostDraftDeadlineReminderEmail, {
    subjectLineBase,
    TemplateVariables,
    defaultParams,
} from "./PostDeadlineReminderEmail";
import { renderAsync } from "@react-email/render";
import send from "./send";

const templateBaseName = "PostDraftDeadlineReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" }), {
            plainText: true,
        }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "reduced" }), {
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
