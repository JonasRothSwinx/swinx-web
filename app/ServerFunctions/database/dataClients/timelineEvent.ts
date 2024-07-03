import { simplify, dayjs } from "@/app/utils";
import { Event, Events } from "../../types";
import database from "../dbOperations";
import { config } from ".";
import { randomId } from "@mui/x-data-grid-generator";
import { useMutation } from "@tanstack/react-query";

export const timelineEvent = {
    create: createTimelineEvent,
    update: updateTimelineEvent,
    list: listAll,
    get: getTimelineEvent,
    delete: deleteTimelineEvent,
    byCampaign: listByCampaign,
    byAssignment: listByAssignment,
};

//MARK: Create Timeline Event
/**
 * Create a new timeline event and update queryClient cache
 * @param timelineEvent The timeline event object to create
 * @returns The created timeline event object
 */
export async function createTimelineEvent(
    timelineEvent: Omit<Event, "id">,
): Promise<Events.EventWithId> {
    // const campaignId = timelineEvent.campaign.id;
    // const queryClient = config.getQueryClient();
    // const assignment = timelineEvent.assignments[0];
    //  const mutation = useMutation()
    // const tempId = randomId();
    // const tempEvent: Event = { ...timelineEvent, id: tempId };
    // queryClient.setQueryData(["timelineEvent", tempId], tempEvent);
    // queryClient.setQueryData(["timelineEvents", campaignId], (prev: Event[]) => {
    //     if (!prev) {
    //         return [tempEvent];
    //     }
    //     return [...prev, tempEvent];
    // });
    // queryClient.setQueryData(["timelineEvents"], (prev: Event[]) => {
    //     if (!prev) {
    //         return [tempEvent];
    //     }
    //     return [...prev, tempEvent];
    // });
    // if (assignment) {
    //     queryClient.setQueryData(["assignmentEvents", assignment.id], (prev: Event[]) => {
    //         if (!prev) {
    //             return [tempEvent];
    //         }
    //         return [...prev, tempEvent];
    //     });
    // }

    const id = await database.timelineEvent.create(simplify(timelineEvent));
    const createdTimelineEvent: Events.EventWithId = { ...timelineEvent, id };

    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvent", id],
    // });
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvents", campaignId],
    // });
    // queryClient.invalidateQueries({
    //     queryKey: ["timelineEvents"],
    // });
    // if (assignment) {
    //     queryClient.invalidateQueries({
    //         queryKey: ["assignmentEvents", assignment.id],
    //     });
    //     queryClient.invalidateQueries({
    //         queryKey: ["assignment", assignment.id],
    //     });
    // }

    // queryClient.refetchQueries({ queryKey: ["timelineEvents"] });
    // queryClient.refetchQueries({ queryKey: ["timelineEvent", id] });
    // queryClient.refetchQueries({ queryKey: ["timelineEvents", campaignId] });
    return createdTimelineEvent;
}

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
    const queryClient = config.getQueryClient();
    const previousTimelineEvent = queryClient.getQueryData<Event>(["timelineEvent", id]);
    if (!previousTimelineEvent) {
        throw new Error("Timeline event not found");
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

//MARK: List Timeline Events
/**
 * List all timeline events
 * @returns The list of timeline events
 */

export async function listAll(): Promise<Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents"]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }
    const timelineEvents = await database.timelineEvent.list();

    timelineEvents.forEach((event) => {
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
export async function listByCampaign(campaignId: string): Promise<Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", campaignId]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }
    const timelineEvents = await database.timelineEvent.listByCampaign(campaignId);

    queryClient.setQueryData(["timelineEvents", campaignId], timelineEvents);
    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        // queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}

//MARK: Delete Timeline Event
/**
 * Delete a timeline event
 * @param id The id of the timeline event to delete
 * @returns void
 */

export async function deleteTimelineEvent(id: string): Promise<void> {
    const queryClient = config.getQueryClient();
    const debug = process.env.NODE_ENV === "development";
    // console.log(debug, "Deleting Timeline Event", id);
    // return;
    const timelineEvent = await getTimelineEvent(id);
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

//MARK: By Assignment
/**
 * List all timeline events, belonging to an assignment
 * @param assignmentId The id of the assignment to list timeline events for
 * @returns The list of timeline events
 */

export async function listByAssignment(assignmentId: string): Promise<Event[]> {
    const queryClient = config.getQueryClient();
    //return cache data if available
    // const cachedTimelineEvents = queryClient.getQueryData(["timelineEvents", assignmentId]) as Event[];
    // if (cachedTimelineEvents) {
    //     return cachedTimelineEvents;
    // }

    const timelineEvents = await database.timelineEvent.listByAssignment(assignmentId);
    timelineEvents.forEach((event) => {
        queryClient.setQueryData(["timelineEvent", event.id], event);
        // queryClient.refetchQueries({ queryKey: ["timelineEvent", event.id] });
    });
    return timelineEvents;
}

/**
 * Get a timeline event by id
 * @param id The id of the timeline event to get
 * @returns The timeline event object
 */

export async function getTimelineEvent(id: string): Promise<Event> {
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
