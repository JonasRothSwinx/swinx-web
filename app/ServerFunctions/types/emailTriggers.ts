import { Nullable, Prettify } from "@/app/Definitions/types";
import { Event, Events, Customer, Influencers } from ".";

export type EmailTrigger = Prettify<
    GeneralInfo & EventInfo & ContactInfo & EmailOverrides & State & CustomerContext
>;
export type EmailTriggerEventRef = Prettify<
    GeneralInfo & EventReference & ContactInfo & EmailOverrides & State
>;
export type EmailTriggerPure = Prettify<GeneralInfo & EmailOverrides & State>;

type GeneralInfo = {
    id?: string;
    date: string;
    type: emailTriggerType;
};
type State = {
    active: boolean;
    sent: boolean;
};
type EventInfo = {
    event: Event;
};
type EventReference = {
    event: { id: string; isCompleted?: boolean };
};
type ContactInfo = {
    influencer?: Prettify<Influencers.WithContactInfo>;
};
type EmailOverrides = {
    emailLevelOverride?: Nullable<emailLevel>;
    subjectLineOverride?: Nullable<string>;
    emailBodyOverride?: Nullable<string>;
};
type CustomerContext = {
    customer?: Customer;
};

export const emailLevels = ["new", "reduced", "none"] as const;
export type emailLevel = (typeof emailLevels)[number];
export function isValidEmailType(level: string): level is emailLevel {
    return emailLevels.includes(level as emailLevel);
}

export const emailTriggerTypes = ["actionReminder", "deadlineReminder"] as const;
export type emailTriggerType = (typeof emailTriggerTypes)[number];

type EmailConfig = { templateName: string };
type EmailLevelConfig = { [key in Exclude<emailLevel, "none">]: Nullable<EmailConfig> };
type EmailTypeConfig = { [key in emailTriggerType]: Nullable<EmailLevelConfig> };
type EventEmailConfig<Collection extends string> = { [key in Collection]: EmailTypeConfig };
const EmailLevelDisplayNames: { [key in emailLevel]: string } = {
    new: "Standard",
    reduced: "Du-Form",
    none: "Keine automatischen Emails",
};
export function getDisplayName(level: emailLevel) {
    return EmailLevelDisplayNames[level];
}
// const SingleEventEmailConfig: EventEmailConfig<TimelineEvent.singleEventType> = {
//     Invites: {
//         actionReminder: {
//             new: { templateName: "inviteActionReminder" },
//             reduced: { templateName: "inviteActionReminderReduced" },
//         },
//         deadlineReminder: null,
//     },
//     Post: {
//         actionReminder: {
//             new: { templateName: "postActionReminder" },
//             reduced: { templateName: "postActionReminderReduced" },
//         },
//         deadlineReminder: {
//             new: { templateName: "postDeadlineReminder" },
//             reduced: { templateName: "postDeadlineReminderReduced" },
//         },
//     },
//     Video: {
//         actionReminder: {
//             new: { templateName: "videoActionReminder" },
//             reduced: { templateName: "videoActionReminderReduced" },
//         },
//         deadlineReminder: {
//             new: { templateName: "videoDeadlineReminder" },
//             reduced: { templateName: "videoDeadlineReminderReduced" },
//         },
//     },
//     WebinarSpeaker: {
//         actionReminder: {
//             new: { templateName: "webinarSpeakerActionReminder" },
//             reduced: { templateName: "webinarSpeakerActionReminderReduced" },
//         },
//         deadlineReminder: {
//             new: { templateName: "webinarSpeakerDeadlineReminder" },
//             reduced: { templateName: "webinarSpeakerDeadlineReminderReduced" },
//         },
//     },
//     ImpulsVideo: {
//         //TODO: Add templates
//         actionReminder: null,
//         deadlineReminder: {
//             new: { templateName: "impulsVideoDeadlineReminder" },
//             reduced: { templateName: "impulsVideoDeadlineReminderReduced" },
//         },
//         // actionReminder: {
//         //     new: { templateName: "impulsVideoActionReminder" },
//         //     reduced: { templateName: "impulsVideoActionReminderReduced" },
//         // },
//         // deadlineReminder: {
//         //     new: { templateName: "impulsVideoDeadlineReminder" },
//         //     reduced: { templateName: "impulsVideoDeadlineReminderReduced" },
//         // },
//     },
// } as const;
// const MultiEventEmailConfig: EventEmailConfig<TimelineEvent.multiEventType> = {
//     Webinar: {
//         actionReminder: null,
//         deadlineReminder: null,
//     },
// } as const;

// export const EmailConfig = {
//     ...SingleEventEmailConfig,
//     ...MultiEventEmailConfig,
// } as const;
// type EmailConfigKey = keyof typeof EmailConfig;

// export function getTemplateName(key: EmailConfigKey, type: emailTriggerType, level: emailLevel) {
//     if (level === "none") return null;
//     const template = EmailConfig?.[key]?.[type]?.[level]?.templateName ?? null;
//     return template;
// }
type timeOffset = {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
};
type EmailTriggerDefinition = {
    offset: timeOffset;
};
type EmailTriggerTypeDefaults = { [key in emailTriggerType]: EmailTriggerDefinition[] };
type EventEmailTriggerDefault = { [key in Events.EventType]: EmailTriggerTypeDefaults };

export const EventEmailTriggerDefaults: EventEmailTriggerDefault = {
    Invites: {
        actionReminder: [
            //
            { offset: { days: 0 } },
            { offset: { days: -1 } },
        ],
        deadlineReminder: [],
    },
    Post: {
        actionReminder: [
            //
            { offset: { days: 0 } },
            { offset: { days: -1 } },
        ],
        deadlineReminder: [{ offset: { days: -3 } }],
    },
    Video: {
        actionReminder: [
            //
            { offset: { days: 0 } },
            { offset: { days: -1 } },
        ],
        deadlineReminder: [{ offset: { days: -3 } }],
    },
    WebinarSpeaker: {
        actionReminder: [
            //
            { offset: { days: 0 } },
            { offset: { days: -1 } },
        ],
        deadlineReminder: [{ offset: { days: -3 } }],
    },
    Webinar: {
        actionReminder: [],
        deadlineReminder: [],
    },
    ImpulsVideo: {
        actionReminder: [],
        deadlineReminder: [{ offset: { days: -3 } }],
    },
} as const;
