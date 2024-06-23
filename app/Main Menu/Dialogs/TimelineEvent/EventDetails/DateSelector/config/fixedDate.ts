import { Nullable, Prettify } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";

interface FixedDateParams {
    parentEvent: Nullable<TimelineEvent.Event>;
}
export const getFixedDate: {
    [key in TimelineEvent.eventType | "none"]: (params: Prettify<FixedDateParams>) => Dayjs | null;
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
    [key in TimelineEvent.eventType | "none"]: boolean;
} = {
    none: false,

    Invites: false,
    ImpulsVideo: true,
    Post: false,
    Video: false,
    WebinarSpeaker: true,

    Webinar: false,
};
