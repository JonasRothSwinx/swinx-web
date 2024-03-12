import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

export type EventCategory = {
    type: string;
    events: TimelineEvent.TimelineEvent[];
};

export default function categorizeEvents(events: TimelineEvent.TimelineEvent[]): EventCategory[] {
    return events.reduce((categories: EventCategory[], event: TimelineEvent.TimelineEvent) => {
        const category = categories.find((category) => category.type === event.timelineEventType);
        if (category) {
            category.events.push(event);
            return categories;
        }
        return [
            ...categories,
            {
                type: event.timelineEventType,
                events: [event],
            },
        ].sort((a, b) => a.type.localeCompare(b.type));
    }, []);
}
