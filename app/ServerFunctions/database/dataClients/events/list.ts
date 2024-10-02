import { Event, Events } from "@/app/ServerFunctions/types";
import { simplify } from "@/app/utils";
import { database } from "@database";
import { dataClient } from "@dataClient";

//MARK: List Timeline Events
/**
 * List all timeline events
 * @returns The list of timeline events
 */

export async function listAll(): Promise<Event[]> {
    const queryClient = dataClient.config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents"]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }
    const timelineEvents = await database.timelineEvent.list();

    timelineEvents.forEach((event) => {
        queryClient.cancelQueries({ queryKey: ["timelineEvent", event.id] });
        queryClient.setQueryData(["timelineEvent", event.id], event);
        // queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    queryClient.setQueryData(["timelineEvents"], timelineEvents);
    return timelineEvents;
}
//MARK: List Timeline Events by Campaign
/**
 * List all timeline events of a campaign
 * @param campaignId The id of the campaign to list timeline events for
 * @returns The list of timeline events
 */
interface ListByCampaignParams {
    campaignId: string;
    filters?: {
        types?: Events.EventType[];
    };
    verbose?: boolean;
}
export async function listByCampaign({
    campaignId,
    filters,
    verbose = false,
}: ListByCampaignParams): Promise<Event[]> {
    const queryClient = dataClient.config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", campaignId]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }
    const timelineEvents = await database.timelineEvent.listByCampaign({
        campaignId,
        filters,
        verbose,
    });

    queryClient.setQueryData(["timelineEvents", campaignId], timelineEvents);
    timelineEvents.forEach((event) => {
        queryClient.cancelQueries({ queryKey: ["timelineEvent", event.id] });
        queryClient.setQueryData(["timelineEvent", event.id], event);
        // queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}

export async function listByCampaignByIds(
    campaignId: string,
    eventIds: string[],
): Promise<Event[]> {
    const queryClient = dataClient.config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", campaignId]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }
    const timelineEvents = await database.timelineEvent.listByCampaignByIds({
        campaignId,
        eventIds,
    });

    queryClient.setQueryData(["timelineEvents", campaignId], timelineEvents);
    timelineEvents.forEach((event) => {
        queryClient.cancelQueries({ queryKey: ["timelineEvent", event.id] });
        queryClient.setQueryData(["timelineEvent", event.id], event);
        // queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}
//MARK: By Assignment
/**
 * List all timeline events, belonging to an assignment
 * @param assignmentId The id of the assignment to list timeline events for
 * @returns The list of timeline events
 */

export async function listByAssignment(assignmentId: string): Promise<Event[]> {
    const queryClient = dataClient.config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", assignmentId]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }

    const timelineEvents = await database.timelineEvent.listByAssignment(assignmentId);

    return timelineEvents;
}
