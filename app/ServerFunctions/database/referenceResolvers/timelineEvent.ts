import { QueryClient } from "@tanstack/react-query";
import TimelineEvent from "../../types/timelineEvents";
import database from "../dbOperations/.database";
import dataClient from "..";
import Assignment from "../../types/assignment";

/**
 * Create a new timeline event and update queryClient cache
 * @param timelineEvent The timeline event object to create
 * @param queryClient The query client to use for updating the cache
 * @returns The created timeline event object
 */
export async function createTimelineEvent(
    timelineEvent: Omit<TimelineEvent.Event, "id">,
    queryClient: QueryClient,
): Promise<TimelineEvent.Event> {
    const id = await database.timelineEvent.create(timelineEvent);
    const createdTimelineEvent = { ...timelineEvent, id };
    queryClient.setQueryData(["timelineEvent", id], { ...timelineEvent, id });
    queryClient.setQueryData(["timelineEvents"], (prev: TimelineEvent.Event[]) => {
        if (!prev) {
            return [createdTimelineEvent];
        }
        return [...prev, createdTimelineEvent];
    });
    queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
    return createdTimelineEvent;
}

/**
 * Update a timeline event
 * @param updatedData The updated timeline event data
 * @param queryClient The query client to use for updating the cache
 * @param previousTimelineEvent The timeline event object before the update, for updating the cache
 * @returns The updated timeline event object
 */
export async function updateTimelineEvent(
    updatedData: Partial<TimelineEvent.Event>,
    queryClient: QueryClient,
    previousTimelineEvent: TimelineEvent.Event,
): Promise<TimelineEvent.Event> {
    const id = previousTimelineEvent.id;
    const campaignId = previousTimelineEvent.campaign.id;
    if (previousTimelineEvent.type !== updatedData.type) {
        throw new Error("Cannot change the type of a timeline event");
    }
    await database.timelineEvent.update(updatedData);
    const updatedTimelineEvent = { ...previousTimelineEvent, ...updatedData };
    queryClient.setQueryData(["timelineEvent", id], updatedTimelineEvent);
    queryClient.setQueryData(["timelineEvents", campaignId], (prev: TimelineEvent.Event[]) => {
        if (!prev) {
            return [updatedTimelineEvent];
        }
        return prev.map((event) => (event.id === id ? updatedTimelineEvent : event));
    });
    queryClient.setQueryData(["timelineEvents"], (prev: TimelineEvent.Event[]) => {
        if (!prev) {
            return [updatedTimelineEvent];
        }
        return prev.map((event) => (event.id === id ? updatedTimelineEvent : event));
    });
    queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    queryClient.refetchQueries({ queryKey: ["timelineEvents", campaignId] });
    queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
    return updatedTimelineEvent as TimelineEvent.Event;
}

/**
 * List all timeline events of a campaign
 * @param campaignId The id of the campaign to list timeline events for
 * @param queryClient The query client to use for updating the cache
 * @returns The list of timeline events
 */
export async function listByCampaign(
    campaignId: string,
    queryClient: QueryClient,
): Promise<TimelineEvent.Event[]> {
    //return cache data if available
    const cachedTimelineEvents = queryClient.getQueryData([
        "timelineEvents",
        campaignId,
    ]) as TimelineEvent.Event[];
    if (cachedTimelineEvents) {
        return cachedTimelineEvents;
    }
    const timelineEvents = await database.timelineEvent.listByCampaign(campaignId);
    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    queryClient.setQueryData(["timelineEvents", campaignId], timelineEvents);
    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}

/**
 * List all timeline events, belonging to an assignment
 * @param assignmentId The id of the assignment to list timeline events for
 * @param queryClient The query client to use for updating the cache
 * @returns The list of timeline events
 */

export async function listByAssignment(
    assignmentId: string,
    queryClient: QueryClient,
): Promise<TimelineEvent.Event[]> {
    //return cache data if available
    const cachedTimelineEvents = queryClient.getQueryData([
        "timelineEvents",
        assignmentId,
    ]) as TimelineEvent.Event[];
    if (cachedTimelineEvents) {
        return cachedTimelineEvents;
    }

    const timelineEvents = await database.timelineEvent.listByAssignment(assignmentId);
    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}

/**
 * Get a timeline event by id
 * @param id The id of the timeline event to get
 * @param queryClient The query client to use for updating the cache
 * @returns The timeline event object
 */

export async function getTimelineEvent(
    id: string,
    queryClient: QueryClient,
): Promise<TimelineEvent.Event> {
    const timelineEvent = await database.timelineEvent.get(id);
    if (!timelineEvent) {
        throw new Error("Timeline event not found");
    }
    return timelineEvent;
}

/**
 * Resolve Reference to a Timeline Event
 * @param timelineEvent     The timeline event reference
 * @param queryClient       The query client to use for updating the cache
 * @param resolveRelated    Whether to resolve related references, to avoid infinite loops
 *
 * @returns                 The full timeline event object
 */

/**
 * The timeline event reference resolver
 *
 * @property resolve             Resolve a timeline event reference
 */

const timelineEvent = {
    create: createTimelineEvent,
    update: updateTimelineEvent,
    get: getTimelineEvent,
    byCampaign: listByCampaign,
    byAssignment: listByAssignment,
};

export default timelineEvent;
