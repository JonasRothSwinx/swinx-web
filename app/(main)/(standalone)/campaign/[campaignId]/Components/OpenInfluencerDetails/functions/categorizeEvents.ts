import { Event, Events } from "@/app/ServerFunctions/types";

export type EventCategory = {
    type: string;
    events: Event[];
};

export default function categorizeEvents(events: Event[]): EventCategory[] {
    return events.reduce((categories: EventCategory[], event: Event) => {
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
            const displayNameA = Events.getDisplayName(a.type);
            const displayNameB = Events.getDisplayName(b.type);
            return displayNameA.localeCompare(displayNameB);
        });
    }, []);
}
