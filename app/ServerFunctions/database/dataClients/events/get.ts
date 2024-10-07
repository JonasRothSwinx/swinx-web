import { Event, Events } from "@/app/ServerFunctions/types";
import { simplify } from "@/app/utils";
import { database } from "@database";
import { dataClient } from "@dataClient";

/**
 * Get a timeline event by id
 * @param id The id of the timeline event to get
 * @returns The timeline event object
 */

export async function getTimelineEvent(id: string): Promise<Event> {
    const queryClient = dataClient.config.getQueryClient();
    const timelineEvent = await database.timelineEvent.get(id);
    if (!timelineEvent) {
        throw new Error("Timeline event not found");
    }
    return timelineEvent;
}
