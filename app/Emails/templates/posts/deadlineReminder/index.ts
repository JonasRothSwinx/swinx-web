import { EmailLevelDefinition, Template } from "../../types";
import PostDraftDeadlineReminderEmail, {
    subjectLineBase,
    defaultParams,
} from "./PostDeadlineReminderEmail";
import { templateNames as templateLevelNames } from "./TemplateVariables";
import { renderAsync } from "@react-email/render";
import send from "./send";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" })),
        text: renderAsync(PostDraftDeadlineReminderEmail({ emailLevel: "new" }), {
            plainText: true,
        }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
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
