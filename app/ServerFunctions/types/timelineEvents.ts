import { Nullable, Prettify } from "@/app/Definitions/types";
import Assignment from "./assignment";
import database from "../database/dbOperations/.database";

namespace TimelineEvent {
    export type Event = Prettify<SingleEvent | MultiEvent>;
    export type EventOrReference = Event | EventReference;

    //#region Common
    export const singleEventValues = ["Invites", "Post", "Video", "WebinarSpeaker"] as const;
    export type singleEventType = (typeof singleEventValues)[number];

    export const multiEventValues = ["Webinar"] as const;
    export type multiEventType = (typeof multiEventValues)[number];

    export const eventValues = [...singleEventValues, ...multiEventValues] as const;
    export type eventType = Prettify<singleEventType | multiEventType>;

    export function isEventReference(event: unknown): event is EventReference {
        const testEvent = event as EventReference;
        return (
            typeof testEvent === "object" &&
            testEvent !== null &&
            typeof testEvent.id === "string" &&
            typeof testEvent.type === "string" &&
            eventValues.includes(testEvent.type as eventType)
        );
    }

    export async function resolveEventReference(
        event: Nullable<EventOrReference>,
    ): Promise<Nullable<Event>> {
        if (event === null) return null;
        else if (!isEventReference(event)) return event;
        else {
            const resolvedEvent = database.timelineEvent.get(event.id);
            return resolvedEvent;
        }
    }

    export function isTimelineEvent(event: unknown): event is Event {
        const testEvent = event as Event;
        return (
            typeof testEvent === "object" &&
            testEvent !== null &&
            typeof testEvent.type === "string" &&
            eventValues.includes(testEvent.type as eventType)
        );
    }
    export function isTimelineEventType(type: unknown): type is eventType {
        return typeof type === "string" && eventValues.includes(type as eventType);
    }
    export function validate(testData: Partial<Event>): testData is Event {
        const testKeys: (keyof Event)[] = ["type", "campaign"];
        if (!testKeys.every((x) => x in testData)) return false;
        const { type, campaign } = testData;
        if (!isTimelineEventType(type)) return false;
        return true;
    }
    export type EventReference = { id: string; type?: eventType };

    type EventCommon = {
        id?: string;
        type: eventType;
        createdAt?: string;
        updatedAt?: string;
        date?: string;
        notes?: Nullable<string>;
        campaign: { id: string };
        eventAssignmentAmount: number;
        eventTaskAmount: Nullable<number>;
        eventTitle: Nullable<string>;
        assignments: Assignment.AssignmentMin[];
        tempId?: string;
        relatedEvents: {
            childEvents: EventOrReference[];
            parentEvent: Nullable<EventOrReference>;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details: Partial<EventDetails>;
    };
    export type EventDetails = {
        topic: string;
        charLimit: number;
        draftDeadline: string;
        instructions: string;
        maxDuration: number;
    };
    //#endregion Common
    //#region Single Event Types
    //#region Types
    type SingleEventCommon = EventCommon & {
        type: singleEventType;
        // assignment: Assignment.AssignmentMin;
        // eventAssignmentAmount: 1;
    };
    export type SingleEvent = Prettify<Invites | Post | Video | WebinarSpeaker>;

    export type Invites = SingleEventCommon & {
        type: "Invites";
        // details?: InvitesDetails;
    };
    export type InvitesDetails = {};

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
        if (!singleEventValues.includes(testEvent.type as singleEventType)) {
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
    type MultiEventCommon = EventCommon & {
        type: multiEventType;
    };
    export type Webinar = MultiEventCommon & {
        type: "Webinar";
        eventAssignmentAmount: number;
        details?: WebinarDetails;
    };
    type WebinarDetails = {};
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
}
export default TimelineEvent;
