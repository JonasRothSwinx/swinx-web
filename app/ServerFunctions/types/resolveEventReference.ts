import { Nullable } from "@/app/Definitions/types";
import database from "../database/dbOperations";
import { EventOrReference, Event, isEventReference } from "./timelineEvent";

export async function resolveEventReference(
    event: Nullable<EventOrReference>,
): Promise<Nullable<Event>> {
    if (event === null) return null;
    else if (!isEventReference(event)) return event;
    else {
        const resolvedEvent = database.timelineEvent.get(event.id);
        return resolvedEvent;
    }
}
