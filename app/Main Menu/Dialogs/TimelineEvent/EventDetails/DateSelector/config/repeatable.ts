import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

export const isRepeatable: {
    [key in TimelineEvent.eventType | "none"]: boolean;
} = {
    none: false,

    Invites: true,
    ImpulsVideo: false,
    Post: false,
    Video: false,
    WebinarSpeaker: false,

    Webinar: false,
};
