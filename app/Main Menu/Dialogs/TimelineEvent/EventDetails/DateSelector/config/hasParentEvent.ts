import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

export const hasParentEvent: {
    [key in TimelineEvent.eventType | "none"]:
        | { parentEventType: TimelineEvent.multiEventType }
        | false;
} = {
    none: false,

    Invites: { parentEventType: "Webinar" },
    ImpulsVideo: { parentEventType: "Webinar" },
    Post: { parentEventType: "Webinar" },
    Video: { parentEventType: "Webinar" },
    WebinarSpeaker: { parentEventType: "Webinar" },

    Webinar: false,
};
