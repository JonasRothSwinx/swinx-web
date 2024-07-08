import { EmailLevelDefinition, Template } from "../../types";
import PostActionReminderMail, { subjectLineBase, defaultParams } from "./PostActionReminderMail";

import { templateNames as templateLevelNames } from "./TemplateVariables";
import { renderAsync } from "@react-email/render";
import { Dayjs } from "@/app/utils";
import send from "./send";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostActionReminderMail({ emailLevel: "new" })),
        text: renderAsync(PostActionReminderMail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
        subjectLine: subjectLineBase,
        html: renderAsync(PostActionReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(PostActionReminderMail({ emailLevel: "reduced" }), { plainText: true }),
    },
};

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
