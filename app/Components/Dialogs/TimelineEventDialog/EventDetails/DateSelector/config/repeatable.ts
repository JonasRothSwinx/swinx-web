import { Events } from "@/app/ServerFunctions/types";

export const isRepeatable: {
    [key in Events.EventType | "none"]: boolean;
} = {
    none: false,

    Invites: true,
    ImpulsVideo: false,
    Post: false,
    Video: false,
    WebinarSpeaker: false,

    Webinar: false,
};
