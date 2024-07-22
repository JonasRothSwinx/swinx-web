import { Events } from "@/app/ServerFunctions/types";
export const hasParentEvent: {
    [key in Events.eventType | "none"]: { parentEventType: Events.multiEventType } | false;
} = {
    none: false,

    Invites: { parentEventType: "Webinar" },
    ImpulsVideo: { parentEventType: "Webinar" },
    Post: { parentEventType: "Webinar" },
    Video: { parentEventType: "Webinar" },
    WebinarSpeaker: { parentEventType: "Webinar" },

    Webinar: false,
};
