import { Event, Events } from "@/app/ServerFunctions/types";
import { simplify } from "@/app/utils";
import { database } from "@database";

//MARK: Create Timeline Event
/**
 * Create a new timeline event and update queryClient cache
 * @param timelineEvent The timeline event object to create
 * @returns The created timeline event object
 */
export async function createTimelineEvent(
    timelineEvent: Omit<Event, "id">,
): Promise<Events.EventWithId> {
    const id = await database.timelineEvent.create(simplify(timelineEvent));
    const createdTimelineEvent: Events.EventWithId = { ...timelineEvent, id };
    return createdTimelineEvent;
}
