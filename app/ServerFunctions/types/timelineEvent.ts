import { Nullable, Prettify } from "@/app/Definitions/types";
import { Assignments, EmailTriggers } from ".";
import { Schema } from "@/amplify/data/resource";

export type Event = Prettify<SingleEvent | MultiEvent>;
export type EventOrReference = Event | EventReference;
export type EventWithId = Prettify<SingleEventWithId | MultiEventWithId>;

//#region Common
export const singleEventValues = [
    "Invites",
    "Post",
    "Video",
    "WebinarSpeaker",
    "ImpulsVideo",
] as const;
export type singleEventType = (typeof singleEventValues)[number];

export const multiEventValues = ["Webinar"] as const;
export type multiEventType = (typeof multiEventValues)[number];

export const eventValues = [...singleEventValues, ...multiEventValues] as const;
export type EventType = Prettify<singleEventType | multiEventType>;

export function isEventReference(event: unknown): event is EventReference {
    const testEvent = event as EventReference;
    return (
        typeof testEvent === "object" &&
        testEvent !== null &&
        typeof testEvent.id === "string" &&
        typeof testEvent.type === "string" &&
        eventValues.includes(testEvent.type)
    );
}

export function isTimelineEvent(event: unknown): event is Event {
    const testEvent = event as Event;
    return (
        typeof testEvent === "object" &&
        testEvent !== null &&
        typeof testEvent.type === "string" &&
        eventValues.includes(testEvent.type as EventType)
    );
}
export function isTimelineEventType(type: unknown): type is EventType {
    return typeof type === "string" && eventValues.includes(type as EventType);
}
export function validate(testData: Partial<Event>): testData is Event {
    const testKeys: (keyof Event)[] = ["type", "campaign"];
    if (!testKeys.every((x) => x in testData)) return false;
    const { type, campaign } = testData;
    if (!isTimelineEventType(type)) return false;
    return true;
}
export type EventReference = { id: string; type?: EventType };
export type EventStatus = NonNullable<Schema["TimelineEvent"]["type"]["status"]>;
type EventCommon = {
    id?: string;
    type: EventType;
    createdAt?: string;
    updatedAt?: string;
    date?: string;
    notes?: Nullable<string>;
    campaign: { id: string };
    eventAssignmentAmount: number;
    eventTaskAmount: Nullable<number>;
    eventTitle: Nullable<string>;
    assignments: Assignments.Min[];
    tempId?: string;
    childEvents: EventOrReference[];
    parentEvent: Nullable<EventOrReference>;
    emailTriggers: EmailTriggers.EmailTriggerEventRef[];
    info: EventInfo;
    targetAudience?: TargetAudience;
    isCompleted: boolean;
    status: EventStatus;
};

type TargetAudience = {
    industry: string[];
    country: string[];
    cities: string[];
};
export type EventInfo = Schema["TimelineEvent"]["type"]["info"];
// export type EventInfo = {
//     topic: string;
//     charLimit: number;
//     draftDeadline: string;
//     instructions: string;
//     maxDuration: number;
// };
//#endregion Common
//#region Single Event Types
//#region Types
type SingleEventCommon = EventCommon & {
    type: singleEventType;
    // assignment: Assignment.AssignmentMin;
    // eventAssignmentAmount: 1;
};
export type SingleEvent = Prettify<Invites | ImpulsVideo | Post | Video | WebinarSpeaker>;
export type SingleEventWithId = Prettify<SingleEvent & { id: string }>;

export type Invites = SingleEventCommon & {
    type: "Invites";
    // details?: InvitesDetails;
};

export type Post = SingleEventCommon & {
    type: "Post";
    // details?: PostDetails;
};

export type Video = SingleEventCommon & {
    type: "Video";
    // details?: Nullable<VideoDetails>;
};

export type WebinarSpeaker = SingleEventCommon & {
    type: "WebinarSpeaker";
    // details?: Nullable<WebinarSpeakerDetails>;
};
export type ImpulsVideo = SingleEventCommon & {
    type: "ImpulsVideo";
    // details?: Nullable<ImpulsVideoDetails>;
};
//#endregion Types
//#region Type Guards
export function isSingleEvent(event: unknown, verbose = false): event is SingleEvent {
    const testEvent = event as SingleEvent;
    if (typeof testEvent !== "object") {
        if (verbose) console.error("isSingleEvent: Not an object");
        return false;
    }
    if (testEvent === null) {
        if (verbose) console.error("isSingleEvent: Null object");
        return false;
    }
    if (typeof testEvent.type !== "string") {
        if (verbose) console.error("isSingleEvent: Missing type");
        return false;
    }
    if (!singleEventValues.includes(testEvent.type)) {
        if (verbose) console.error("isSingleEvent: Invalid type");
        return false;
    }

    return true;
}
export function isSingleEventType(type: unknown): type is singleEventType {
    return typeof type === "string" && singleEventValues.includes(type as singleEventType);
}
export function isInviteEvent(timelineEvent: Event): timelineEvent is Invites {
    return timelineEvent.type === "Invites";
}
export function isPostEvent(timelineEvent: Event): timelineEvent is Post {
    return timelineEvent.type === "Post";
}
export function isVideoEvent(timelineEvent: Event): timelineEvent is Video {
    return timelineEvent.type === "Video";
}
//#endregion Type Guards
//#endregion Single Event Types

//#region Multi Event Types
//#region Types
export type MultiEvent = Webinar;
export type MultiEventWithId = Prettify<MultiEvent & { id: string }>;
type MultiEventCommon = EventCommon & {
    type: multiEventType;
};
export type Webinar = MultiEventCommon & {
    type: "Webinar";
    eventAssignmentAmount: number;
};
//#endregion Types
//#region Type Guards
export function isMultiEvent(event: unknown, verbose = false): event is MultiEvent {
    const testEvent = event as MultiEvent;
    if (typeof testEvent !== "object") {
        if (verbose) console.error("isMultiEvent: Not an object");
        return false;
    }
    if (testEvent === null) {
        if (verbose) console.error("isMultiEvent: Null object");
        return false;
    }
    if (typeof testEvent.type !== "string") {
        if (verbose) console.error("isMultiEvent: Missing type");
        return false;
    }
    if (!multiEventValues.includes(testEvent.type as multiEventType)) {
        if (verbose) console.error("isMultiEvent: Invalid type");
        return false;
    }
    return true;
    // return (
    //     typeof testEvent === "object" &&
    //     testEvent !== null &&
    //     typeof testEvent.type === "string" &&
    //     multiEventValues.includes(testEvent.type as multiEventType)
    // );
}
export function isMultiEventType(type: unknown): type is multiEventType {
    return typeof type === "string" && multiEventValues.includes(type as multiEventType);
}
export function isWebinarEvent(event: Event): event is Webinar {
    return event.type === "Webinar";
}
//#endregion Type Guards
//#endregion Multi Event Types

//#region Display
export const EventTypeDisplayName: { [key in EventType]: { sing: string; plur: string } } = {
    ImpulsVideo: { sing: "Impulsvideo", plur: "Impulsvideos" },
    Invites: { sing: "Einladung", plur: "Einladungen" },
    Post: { sing: "Textbeitrag", plur: "Textbeiträge" },
    Video: { sing: "Videobeitrag", plur: "Videobeiträge" },
    WebinarSpeaker: { sing: "Speaker", plur: "Speaker" },
    Webinar: { sing: "Webinar", plur: "Webinare" },
};
export function getDisplayName(entry: string, form: "sing" | "plur" = "sing") {
    switch (true) {
        case eventValues.includes(entry as EventType): {
            return EventTypeDisplayName[entry as EventType][form];
        }
        default: {
            return entry;
        }
    }
}
//#endregion Display
