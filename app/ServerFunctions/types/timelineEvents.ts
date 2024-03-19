import { Nullable, Prettify } from "@/app/Definitions/types";
import Assignment from "./assignment";

namespace TimelineEvent {
    export type Event = Prettify<SingleEvent | MultiEvent>;

    //#region Common
    export const singleEventValues = ["Invites", "Post", "Video", "WebinarSpeaker"] as const;
    export type singleEventType = (typeof singleEventValues)[number];

    export const multiEventValues = ["Webinar"] as const;
    export type multiEventType = (typeof multiEventValues)[number];

    export const eventValues = [...singleEventValues, ...multiEventValues] as const;
    export type eventType = Prettify<singleEventType | multiEventType>;

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
    };
    //#endregion Common
    //#region Single Event Types
    //#region Types
    type SingleEventCommon = EventCommon & {
        type: singleEventType;
        assignment: Assignment.AssignmentMin;
        eventAssignmentAmount: 1;
    };
    export type SingleEvent = Invites | Post | Video | WebinarSpeaker;

    export type Invites = SingleEventCommon & {
        type: "Invites";
    };

    export type Post = SingleEventCommon & {
        type: "Post";
    };

    export type Video = SingleEventCommon & {
        type: "Video";
    };
    export type WebinarSpeaker = SingleEventCommon & {
        type: "WebinarSpeaker";
    };

    export type InviteEvent = {
        id?: string;
        invites?: number;
    };
    //#endregion Types
    //#region Type Guards
    export function isSingleEvent(event: unknown): event is SingleEvent {
        const testEvent = event as SingleEvent;
        return (
            typeof testEvent === "object" &&
            testEvent !== null &&
            typeof testEvent.type === "string" &&
            singleEventValues.includes(testEvent.type as singleEventType)
        );
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
        assignments: Assignment.AssignmentMin[];
    };
    export type Webinar = MultiEventCommon & {
        type: "Webinar";
        eventAssignmentAmount: number;
    };
    //#endregion Types
    //#region Type Guards
    export function isMultiEvent(event: unknown): event is MultiEvent {
        const testEvent = event as MultiEvent;
        return (
            typeof testEvent === "object" &&
            testEvent !== null &&
            typeof testEvent.type === "string" &&
            multiEventValues.includes(testEvent.type as multiEventType)
        );
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
