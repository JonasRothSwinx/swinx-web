import { EmailLevelDefinition, MailTemplate, Template } from "../../types";
import { renderAsync } from "@react-email/render";
import WebinarSpeakerActionReminderMail, {
    subjectLineBase,
    defaultParams,
} from "./WebinarSpeakerDateReminder";
import send from "./send";

const templateBaseName = "WebinarSpeakerActionReminder";

const templates: EmailLevelDefinition = {
    new: {
        name: `${templateBaseName}New`,
        subjectLine: subjectLineBase,
        html: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "new" })),
        text: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "new" }), {
            plainText: true,
        }),
    },
    reduced: {
        name: `${templateBaseName}Reduced`,
        subjectLine: subjectLineBase,
        html: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "reduced" })),
        text: renderAsync(WebinarSpeakerActionReminderMail({ emailLevel: "reduced" }), {
            plainText: true,
        }),
    },
} as const;

export const templateNames = [
    ...Object.values(templates).map((template) => template.name),
] as const;

export const WebinarSpeakerActionReminder = {
    defaultParams,
    send,
    levels: templates,
    templateNames,
} as const satisfies Template;

export default WebinarSpeakerActionReminder;
