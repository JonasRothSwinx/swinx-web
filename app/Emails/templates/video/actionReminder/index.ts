import { EmailLevelDefinition, MailTemplate, Template } from "../../types";
import VideoPublishReminderEmail, {
    subjectLineBase,
    defaultParams,
} from "./VideoActionReminderEmail";
import { renderAsync } from "@react-email/render";
import send from "./send";
import { templateNames as templateLevelNames } from "./TemplateVariables";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateLevelNames.new}`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateLevelNames.reduced}`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoPublishReminderEmail({ emailLevel: "reduced" })),
        text: renderAsync(VideoPublishReminderEmail({ emailLevel: "reduced" }), {
            plainText: true,
        }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export const VideoReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default VideoReminder;
