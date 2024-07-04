import { EmailLevelDefinition, Template } from "../../types";
import PostActionReminderMail, {
    subjectLineBase,
    TemplateVariables,
    defaultParams,
} from "./PostActionReminderMail";
import { renderAsync } from "@react-email/render";
import { Dayjs } from "@/app/utils";
import send from "./send";

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
