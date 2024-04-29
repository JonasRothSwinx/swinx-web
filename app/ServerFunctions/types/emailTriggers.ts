import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { Nullable, Prettify } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import Influencer from "./influencer";
import influencer from "../database/dataClients/influencer";
import database from "../database/dbOperations";
import Customer from "./customer";

export namespace EmailTriggers {
    export type EmailTrigger = Prettify<
        GeneralInfo & EventInfo & ContactInfo & EmailOverrides & State & CustomerContext
    >;
    export type EmailTriggerEventRef = Prettify<GeneralInfo & EventReference & ContactInfo & EmailOverrides & State>;

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
        event: TimelineEvent.Event;
    };
    type EventReference = {
        event: { id: string };
    };
    type ContactInfo = {
        influencer?: Prettify<Influencer.WithContactInfo>;
    };
    type EmailOverrides = {
        emailLevelOverride?: Nullable<emailLevel>;
        subjectLineOverride?: Nullable<string>;
        emailBodyOverride?: Nullable<string>;
    };

    type CustomerContext = {
        customer?: Customer.Customer;
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

    const SingleEventEmailConfig: EventEmailConfig<TimelineEvent.singleEventType> = {
        Invites: {
            actionReminder: {
                new: { templateName: "inviteActionReminder" },
                reduced: { templateName: "inviteActionReminderReduced" },
            },
            deadlineReminder: null,
        },
        Post: {
            actionReminder: {
                new: { templateName: "postActionReminder" },
                reduced: { templateName: "postActionReminderReduced" },
            },
            deadlineReminder: {
                new: { templateName: "postDeadlineReminder" },
                reduced: { templateName: "postDeadlineReminderReduced" },
            },
        },
        Video: {
            actionReminder: {
                new: { templateName: "videoActionReminder" },
                reduced: { templateName: "videoActionReminderReduced" },
            },
            deadlineReminder: {
                new: { templateName: "videoDeadlineReminder" },
                reduced: { templateName: "videoDeadlineReminderReduced" },
            },
        },
        WebinarSpeaker: {
            actionReminder: {
                new: { templateName: "webinarSpeakerActionReminder" },
                reduced: { templateName: "webinarSpeakerActionReminderReduced" },
            },
            deadlineReminder: {
                new: { templateName: "webinarSpeakerDeadlineReminder" },
                reduced: { templateName: "webinarSpeakerDeadlineReminderReduced" },
            },
        },
    } as const;
    const MultiEventEmailConfig: EventEmailConfig<TimelineEvent.multiEventType> = {
        Webinar: {
            actionReminder: null,
            deadlineReminder: null,
        },
    } as const;

    export const EmailConfig = {
        ...SingleEventEmailConfig,
        ...MultiEventEmailConfig,
    } as const;
    type EmailConfigKey = keyof typeof EmailConfig;

    export function getTemplateName(key: EmailConfigKey, type: emailTriggerType, level: emailLevel) {
        if (level === "none") return null;
        const template = EmailConfig?.[key]?.[type]?.[level]?.templateName ?? null;
        return template;
    }
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
    type EmailTriggerTypeDefaults = { [key in emailTriggerType]: Nullable<EmailTriggerDefinition> };
    type EventEmailTriggerDefault = { [key in TimelineEvent.eventType]: EmailTriggerTypeDefaults };

    export const EventEmailTriggerDefaults: EventEmailTriggerDefault = {
        Invites: {
            actionReminder: { offset: { days: -1 } },
            deadlineReminder: null,
        },
        Post: {
            actionReminder: { offset: { days: -1 } },
            deadlineReminder: { offset: { days: -7 } },
        },
        Video: {
            actionReminder: { offset: { days: -1 } },
            deadlineReminder: { offset: { days: -7 } },
        },
        WebinarSpeaker: {
            actionReminder: { offset: { days: -1 } },
            deadlineReminder: { offset: { days: -7 } },
        },
        Webinar: {
            actionReminder: null,
            deadlineReminder: null,
        },
    } as const;
}
