import { Events } from "@/app/ServerFunctions/types";

export const EventHasEmailTriggers: { [key in Events.EventType | "none"]: boolean } = {
    none: false,

    Invites: true,
    ImpulsVideo: true,
    Post: true,
    Video: true,
    WebinarSpeaker: true,

    Webinar: false,
};
