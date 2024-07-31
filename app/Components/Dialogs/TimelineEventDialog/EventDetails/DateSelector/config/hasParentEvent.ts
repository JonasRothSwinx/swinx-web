import { Events } from "@/app/ServerFunctions/types";
export const hasParentEvent: {
    [key in Events.eventType | "none"]: Events.multiEventType | false;
} = {
    none: false,

    Invites: "Webinar",
    ImpulsVideo: "Webinar",
    Post: "Webinar",
    Video: "Webinar",
    WebinarSpeaker: "Webinar",

    Webinar: false,
};
