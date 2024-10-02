import { Event, Events } from "@/app/ServerFunctions/types";
import { simplify } from "@/app/utils";
import { database } from "@database";
import { dataClient } from "@dataClient";

//MARK: Delete Timeline Event
/**
 * Delete a timeline event
 * @param id The id of the timeline event to delete
 * @returns void
 */

export async function deleteTimelineEvent(id: string): Promise<void> {
    const queryClient = dataClient.config.getQueryClient();
    const debug = process.env.NODE_ENV === "development";
    // console.log(debug, "Deleting Timeline Event", id);
    // return;
    const timelineEvent = await dataClient.event.get(id);
    const campaignId = timelineEvent.campaign.id;
    queryClient.setQueryData(["timelineEvent", id], undefined);
    queryClient.setQueryData(["timelineEvents", campaignId], (prev: Event[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((event) => event.id !== id);
    });
    queryClient.setQueryData(["timelineEvents"], (prev: Event[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((event) => event.id !== id);
    });
    queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    queryClient.refetchQueries({ queryKey: ["timelineEvents", campaignId] });
    queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
    const data = await database.timelineEvent.delete({ id, debug });
    console.log("Deleted Timeline Event", data ?? "");
}
