import { Event, Events } from "@/app/ServerFunctions/types";
import { simplify } from "@/app/utils";
import { database } from "@database";
import { dataClient } from "@dataClient";

//MARK: Update Timeline Event
/**
 * Update a timeline event
 * @param updatedData The updated timeline event data
 * @param previousTimelineEvent The timeline event object before the update, for updating the cache
 * @returns The updated timeline event object
 */
interface UpdateTimelineEventParams {
    id: string;
    updatedData: Partial<Event>;
}
export async function updateTimelineEvent({
    id,
    updatedData,
}: UpdateTimelineEventParams): Promise<Event> {
    // debugger;
    const queryClient = dataClient.config.getQueryClient();
    const previousTimelineEvent =
        queryClient.getQueryData<Event>(["timelineEvent", id]) ??
        (await database.timelineEvent.get(id));
    if (!previousTimelineEvent) {
        throw new Error(`Timeline event not found for id: "${id}"`);
    }
    const campaignId = previousTimelineEvent.campaign.id;
    if (updatedData.type && previousTimelineEvent.type !== updatedData.type) {
        throw new Error("Cannot change the type of a timeline event");
    }
    await database.timelineEvent.update({ id, updatedData });
    const updatedTimelineEvent = { ...previousTimelineEvent, ...updatedData };
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvent", id],
    //     type: "all",
    // });
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvents", campaignId],
    //     type: "all",
    // });
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvents"],
    //     type: "all",
    // });

    // queryClient.setQueryData(["timelineEvent", id], updatedTimelineEvent);
    // queryClient.setQueryData(["timelineEvents", campaignId], (prev: Event[]) => {
    //     if (!prev) {
    //         return [updatedTimelineEvent];
    //     }
    //     return prev.map((event) => (event.id === id ? updatedTimelineEvent : event));
    // });
    // queryClient.setQueryData(["timelineEvents"], (prev: Event[]) => {
    //     if (!prev) {
    //         return [updatedTimelineEvent];
    //     }
    //     return prev.map((event) => (event.id === id ? updatedTimelineEvent : event));
    // });
    // queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    // queryClient.refetchQueries({ queryKey: ["timelineEvents", campaignId] });
    // queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
    return updatedTimelineEvent as Event;
}
