import TimelineEvent from "@/app/ServerFunctions/types/timelineEvent";

export type EventCategory = {
    type: string;
    events: TimelineEvent.Event[];
};

export default function categorizeEvents(events: TimelineEvent.Event[]): EventCategory[] {
    return events.reduce((categories: EventCategory[], event: TimelineEvent.Event) => {
        const category = categories.find((category) => category.type === event.type);
        if (category) {
            category.events.push(event);
            return categories;
        }
        return [
            ...categories,
            {
                type: event.type,
                events: [event],
            },
        ].sort((a, b) => {
            const displayNameA = TimelineEvent.getDisplayName(a.type);
            const displayNameB = TimelineEvent.getDisplayName(b.type);
            return displayNameA.localeCompare(displayNameB);
        });
    }, []);
}
