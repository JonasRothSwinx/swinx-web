import { Nullable, Prettify } from "@/app/Definitions/types";
import { Event, Events } from "@/app/ServerFunctions/types";
import { dayjs, Dayjs } from "@/app/utils";

interface FixedDateParams {
    parentEvent: Nullable<Event>;
}
export const getFixedDate: {
    [key in Events.eventType | "none"]: (params: Prettify<FixedDateParams>) => Dayjs | null;
} = {
    none: () => null,

    Invites: () => null,
    ImpulsVideo: ({ parentEvent }) => (parentEvent ? dayjs(parentEvent.date) : null),
    Post: () => null,
    Video: () => null,
    WebinarSpeaker: ({ parentEvent }) => (parentEvent ? dayjs(parentEvent.date) : null),

    Webinar: () => null,
};

export const isFixedDate: {
    [key in Events.eventType | "none"]: boolean;
} = {
    none: false,

    Invites: false,
    ImpulsVideo: true,
    Post: false,
    Video: false,
    WebinarSpeaker: true,

    Webinar: false,
};
