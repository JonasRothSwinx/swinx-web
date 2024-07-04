import { TimelineEvent } from "./Database/types";
import { dayjs } from "@/app/utils";

interface sortEventsParams {
    events: TimelineEvent[];
}

export type SortedEvents = {
    [key: string]: TimelineEvent[];
};

export default function sortEvents({ events }: sortEventsParams) {
    const groupedEvents: SortedEvents = {};

    events.reduce((acc, event) => {
        if (!acc[event.timelineEventType]) {
            acc[event.timelineEventType] = [];
        }
        acc[event.timelineEventType].push(event);
        return acc;
    }, groupedEvents);

    // Sort the events by date
    Object.keys(groupedEvents).forEach((key) => {
        groupedEvents[key].sort((a, b) => {
            return dayjs(a.date).diff(dayjs(b.date));
        });
    });
    return groupedEvents;
}
