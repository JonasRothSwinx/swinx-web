import { Prettify } from "@/app/Definitions/types";
import Assignment from "./assignment";

namespace TimelineEvent {
    export type TimelineEvent = Prettify<
        TimelineEventInvites | TimelineEventPost | TimelineEventVideo | TimelineEventGeneric | TimelineEventWebinar
    >;
    export function validate(testData: Partial<TimelineEvent>): testData is TimelineEvent {
        const testKeys: (keyof TimelineEvent)[] = ["timelineEventType", "assignment", "campaign"];
        if (testKeys.every((x) => x in testData)) {
            return true;
        }
        return false;
    }
    type TimelineEventStub = {
        id?: string;
        timelineEventType: string;
        assignment: Assignment.AssignmentMin;
        // influencerAssignmentId: string;
        createdAt?: string;
        updatedAt?: string;
        date?: string;
        notes?: string | null;
        campaign: { id: string };
    };
    export function isInviteEvent(timelineEvent: TimelineEvent): timelineEvent is TimelineEventInvites {
        return timelineEvent.timelineEventType === "Invites";
    }
    export type TimelineEventInvites = {
        inviteEvent?: InviteEvent;
    } & TimelineEventStub;

    export function isPostEvent(timelineEvent: TimelineEvent): timelineEvent is TimelineEventPost {
        return timelineEvent.timelineEventType === "Post";
    }
    export type TimelineEventPost = {} & TimelineEventStub;

    export function isVideoEvent(timelineEvent: TimelineEvent): timelineEvent is TimelineEventVideo {
        return timelineEvent.timelineEventType === "Video";
    }
    export type TimelineEventVideo = {} & TimelineEventStub;

    export type TimelineEventGeneric = {} & TimelineEventStub;

    export type InviteEvent = {
        id?: string;
        invites?: number;
    };
    export function isWebinarEvent(timelineEvent: TimelineEvent): timelineEvent is TimelineEventWebinar {
        return timelineEvent.timelineEventType === "Webinar";
    }
    export type TimelineEventWebinar = TimelineEventStub & {
        webinar?: WebinarEvent;
    };
    export type WebinarEvent = {
        id?: string;
        date: string;
        title: string;
    };
    export type WebinarSpeaker = {
        type: "WebinarSpeaker";
    } & TimelineEventStub;
}
export default TimelineEvent;
