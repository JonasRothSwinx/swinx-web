import { EmailLevelDefinition, MailTemplate, Template } from "../../types";
import VideoPublishReminderEmail, {
    subjectLineBase,
    defaultParams,
} from "./VideoActionReminderEmail";
import { renderAsync } from "@react-email/render";
import send from "./send";

const templateBaseName = "VideoReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" })),
        text: renderAsync(VideoPublishReminderEmail({ emailLevel: "new" }), { plainText: true }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
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
