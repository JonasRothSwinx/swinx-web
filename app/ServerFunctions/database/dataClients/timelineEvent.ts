import { simplify } from "@/app/utils/simplify";
import TimelineEvent from "../../types/timelineEvents";
import database from "../dbOperations";
import config from "./config";
import dayjs from "@/app/utils/configuredDayJs";

/**
 * Create a new timeline event and update queryClient cache
 * @param timelineEvent The timeline event object to create
 * @returns The created timeline event object
 */
export async function createTimelineEvent(
    timelineEvent: Omit<TimelineEvent.Event, "id">
): Promise<TimelineEvent.EventWithId> {
    const queryClient = config.getQueryClient();
    const id = await database.timelineEvent.create(simplify(timelineEvent));
    const createdTimelineEvent: TimelineEvent.EventWithId = { ...timelineEvent, id, info: {} };
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
 * @param previousTimelineEvent The timeline event object before the update, for updating the cache
 * @returns The updated timeline event object
 */
export async function updateTimelineEvent(
    updatedData: Partial<TimelineEvent.Event>,
    previousTimelineEvent: TimelineEvent.Event
): Promise<TimelineEvent.Event> {
    const queryClient = config.getQueryClient();
    const id = previousTimelineEvent.id;
    const campaignId = previousTimelineEvent.campaign.id;
    if (updatedData.type && previousTimelineEvent.type !== updatedData.type) {
        throw new Error("Cannot change the type of a timeline event");
    }
    await database.timelineEvent.update({ ...updatedData, id });
    const updatedTimelineEvent = { ...previousTimelineEvent, ...updatedData };
    queryClient.invalidateQueries({
        queryKey: ["timelineEvent", id],
        type: "all",
    });
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvents"],
    //     type: "all",
    // });
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
 * List all timeline events
 * @returns The list of timeline events
 */

export async function listAll(): Promise<TimelineEvent.Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents"]) as TimelineEvent.Event[];
    if (cachedTimelineEvents) {
        return cachedTimelineEvents;
    }
    const timelineEvents = await database.timelineEvent.list();

    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    queryClient.setQueryData(["timelineEvents"], timelineEvents);
    return timelineEvents;
}

/**
 * List all timeline events of a campaign
 * @param campaignId The id of the campaign to list timeline events for
 * @returns The list of timeline events
 */
export async function listByCampaign(campaignId: string): Promise<TimelineEvent.Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", campaignId]) as TimelineEvent.Event[];
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
 * Delete a timeline event
 * @param id The id of the timeline event to delete
 * @returns void
 */

export async function deleteTimelineEvent(id: string): Promise<void> {
    const queryClient = config.getQueryClient();
    const timelineEvent = await getTimelineEvent(id);
    const campaignId = timelineEvent.campaign.id;
    await database.timelineEvent.delete({ id });
    queryClient.setQueryData(["timelineEvent", id], undefined);
    queryClient.setQueryData(["timelineEvents", campaignId], (prev: TimelineEvent.Event[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((event) => event.id !== id);
    });
    queryClient.setQueryData(["timelineEvents"], (prev: TimelineEvent.Event[]) => {
        if (!prev) {
            return [];
        }
        return prev.filter((event) => event.id !== id);
    });
    queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    queryClient.refetchQueries({ queryKey: ["timelineEvents", campaignId] });
    queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
}

/**
 * List all timeline events, belonging to an assignment
 * @param assignmentId The id of the assignment to list timeline events for
 * @returns The list of timeline events
 */

export async function listByAssignment(assignmentId: string): Promise<TimelineEvent.Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", assignmentId]) as TimelineEvent.Event[];
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
 * @returns The timeline event object
 */

export async function getTimelineEvent(id: string): Promise<TimelineEvent.Event> {
    const queryClient = config.getQueryClient();
    const timelineEvent = await database.timelineEvent.get(id);
    if (!timelineEvent) {
        throw new Error("Timeline event not found");
    }
    return timelineEvent;
}

// /**
//  * Resolve Reference to a Timeline Event
//  * @param timelineEvent     The timeline event reference
//  * @param queryClient       The query client to use for updating the cache
//  * @param resolveRelated    Whether to resolve related references, to avoid infinite loops
//  *
//  * @returns                 The full timeline event object
//  */

/**
 * The timeline event reference resolver
 *
 * @property resolve             Resolve a timeline event reference
 */

const timelineEvent = {
    create: createTimelineEvent,
    update: updateTimelineEvent,
    list: listAll,
    get: getTimelineEvent,
    delete: deleteTimelineEvent,
    byCampaign: listByCampaign,
    byAssignment: listByAssignment,
};

export default timelineEvent;
