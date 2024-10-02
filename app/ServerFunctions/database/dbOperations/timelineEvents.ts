"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import { client } from "./_dbclient";
import database from ".";
import { dayjs } from "@/app/utils";
import { EmailTriggers, Customer, Event, Assignment, Events, Assignments } from "../../types";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

export async function dummy() {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet: [
            //Event info
            "id",
            "timelineEventType",
            "eventAssignmentAmount",
            "eventTitle",
            "eventTaskAmount",
            "date",
            "notes",
            "info.*",
            "status",

            //campaign info
            "campaign.id",

            //assignment info
            "assignments.*",
            "assignments.assignment.id",
            "assignments.assignment.isPlaceholder",
            "assignments.assignment.placeholderName",
            "assignments.assignment.influencer.id",
            "assignments.assignment.influencer.firstName",
            "assignments.assignment.influencer.lastName",

            // "assignments.influencerAssignment.id",

            "assignments.assignment.id",

            //child events
            "childEvents.id",
            "parentEventId",
        ],
    });
    return { data: JSON.parse(JSON.stringify(data)), errors };
}
//MArk: Selection Set
const selectionSet = [
    //Event info
    "id",
    "timelineEventType",
    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",
    "date",
    "notes",
    "info.*",
    "isCompleted",
    "status",

    //campaign info
    "campaign.id",

    //assignment info
    "assignments.*",
    "assignments.assignment.id",
    "assignments.assignment.isPlaceholder",
    "assignments.assignment.placeholderName",
    "assignments.assignment.influencer.id",
    "assignments.assignment.influencer.firstName",
    "assignments.assignment.influencer.lastName",

    //child events
    "childEvents.id",
    "childEvents.timelineEventType",
    "parentEventId",

    //email triggers
    "emailTriggers.*",

    //target audience
    "targetAudience.*",
] as const;
type RawEvent = SelectionSet<Schema["TimelineEvent"]["type"], typeof selectionSet>;

const selectionSetMin = ["id", "timelineEventType", "campaign.id"] as const;

export async function listTimelineEvents(): Promise<Event[]> {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet: selectionSet,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log("timeline", { data });
    const events: Event[] = validateArray(data);
    return events;
}

//#region create
/**
 * Creates a new timeline event in the database.
 * @param props - The properties of the timeline event to create.
 * @returns The ID of the created timeline event.
 * @throws {Error} If any required data is missing or if there are any errors during the creation.
 */
export async function createTimelineEvent(props: Omit<Event, "id">) {
    // console.log(props);
    const {
        type: timelineEventType,
        date,
        notes,
        eventAssignmentAmount,
        eventTitle,
        eventTaskAmount,
        info,
        parentEvent,
        childEvents,
        targetAudience,
    } = props;
    const { id: campaignId } = props.campaign;
    if (!(date && campaignId)) {
        throw new Error("Missing Data");
    }
    const parentEventId = parentEvent?.id;
    // console.log("creating multiEvent", { props });
    const { data, errors } = await client.models.TimelineEvent.create(
        {
            timelineEventType,
            date,
            campaignId,
            notes,
            eventAssignmentAmount,
            eventTitle,
            eventTaskAmount,
            info: info,
            parentEventId,
            targetAudience,
            status: "WAITING_FOR_DRAFT",
        },
        {},
    );
    if (!data || !data.id) {
        console.error("No ID", data);
        throw "failed to create Event";
    }
    //create join table entries
    const assignments = props.assignments ?? [];
    // console.log("assignments", assignments);
    const connectionResponse = await Promise.all(
        assignments.map(async (assignment) => {
            return await connectToAssignment(data.id, assignment.id);
        }),
    );
    const connectionData = connectionResponse.map((x) => x.data);
    const connectionErrors = connectionResponse.map((x) => x.errors);
    // console.log({ connectionData, connectionErrors });
    if (errors) throw new Error(JSON.stringify(errors));
    if (connectionErrors.length > 0 && connectionErrors.some((x) => x !== null && x !== undefined))
        throw new Error(JSON.stringify(connectionErrors));
    // console.log(data);
    return data.id;
}
//#endregion

//#region update
/**
 * Updates a timeline event with the provided properties.
 * @param props - The properties to update the timeline event with.
 * @returns - Promise that resolves when the timeline event is updated successfully.
 * @throws - Error if any required data is missing or if there are any errors during the update.
 */
interface UpdateTimelineEventParams {
    id: string;
    updatedData: Partial<Event>;
}
export async function updateTimelineEvent({ id, updatedData }: UpdateTimelineEventParams) {
    const {
        type: timelineEventType,
        campaign: { id: campaignId } = {},
        date,
        notes,
        info,
        eventAssignmentAmount,
        eventTaskAmount,
        eventTitle,
        childEvents,
        targetAudience,
        isCompleted,
        status,
    } = updatedData;

    if (!id) {
        throw new Error("Missing Data");
    }

    const newEvent: Partial<Schema["TimelineEvent"]["type"]> = {
        id,
        ...(date && { date }),
        ...(notes && { notes }),
        ...(timelineEventType && { timelineEventType }),
        ...(campaignId && { campaignId }),
        ...(eventAssignmentAmount && { eventAssignmentAmount }),
        ...(eventTaskAmount && { eventTaskAmount }),
        ...(eventTitle && { eventTitle }),
        ...(info && { info }),
        ...(targetAudience && { targetAudience }),
        ...(status && { status }),
        isCompleted,
    };

    // const { data, errors } = await client.models.TimelineEvent.update({
    //     id: id,
    //     ...(date ? { date: date } : {}),
    //     ...(notes ? { notes: notes } : {}),
    //     ...(timelineEventType ? { timelineEventType: timelineEventType } : {}),
    //     ...(campaignId ? { campaignId: campaignId } : {}),
    //     ...(eventAssignmentAmount ? { eventAssignmentAmount: eventAssignmentAmount } : {}),
    //     ...(eventTaskAmount ? { eventTaskAmount: eventTaskAmount } : {}),
    //     ...(eventTitle ? { eventTitle: eventTitle } : {}),
    //     ...(info ? { info: info } : {}),
    // });
    const { data, errors } = await client.models.TimelineEvent.update({ id, ...newEvent });
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data, errors });
}
//#endregion

//#region delete
/**
 * Deletes a timeline event from the database.
 * @param event - The event to delete.
 * @throws {Error} If the event does not have an ID.
 * @throws {Error} If there are any errors during the database operation.
 * @returns void
 */
interface DeleteTimelineEventParams {
    id: string;
    debug?: boolean;
}
export async function deleteTimelineEvent({ id, debug }: DeleteTimelineEventParams) {
    if (!id) throw new Error("DeleteTimelineEvent: No ID provided");

    //find and delete all connections
    const { data: connectionData, errors: connectionErrors } =
        await client.models.EventAssignment.list({
            selectionSet: ["id"],
            filter: { timelineEventId: { eq: id } },
        });
    if (debug) console.log(`Found ${connectionData.length} connections`);

    const connectionDeleteResponse = await Promise.all(
        connectionData.map(async (x: unknown) => {
            console.log({ connection: x });
            const connection = x as { id: string };
            return client.models.EventAssignment.delete({ id: connection.id });
        }),
    );
    if (debug) console.log("Deleted Event Connections:", { connectionDeleteResponse });

    //find and delete all childEvents
    const { data: childEventData, errors: childEventErrors } =
        await client.models.TimelineEvent.list({
            selectionSet: ["id"],
            filter: { parentEventId: { eq: id } },
        });
    if (debug) console.log(`Found ${childEventData.length} child events`);

    if (childEventData.length > 0) {
        const childEventDeleteResponse = await Promise.all(
            childEventData.map(async (x) => {
                const childEvent = x;
                return deleteTimelineEvent({ id: childEvent.id });
            }),
        );
        if (debug) console.log("Deleted Child Events:", { childEventDeleteResponse });
    }

    //find and delete all email triggers
    const { data: emailTriggerData, errors: emailTriggerErrors } =
        await client.models.EmailTrigger.list({
            selectionSet: ["id"],
            filter: { eventId: { eq: id } },
        });
    if (debug) console.log(`Found ${emailTriggerData.length} email triggers`);

    if (emailTriggerData.length > 0) {
        const emailTriggerDeleteResponse = await Promise.all(
            emailTriggerData.map(async (x) => {
                const emailTrigger = x;
                return database.emailTrigger.delete({ id: emailTrigger.id });
            }),
        );
        if (debug) console.log("Deleted Email Triggers:", { emailTriggerDeleteResponse });
    }

    //delete the event
    console.log("Deleting Event", { id });
    const { errors } = await client.models.TimelineEvent.delete({ id });
    if (errors) throw new Error(JSON.stringify(errors));
    if (debug) {
        return {
            connections: connectionData.length,
            childEvents: childEventData.length,
            emailTriggers: emailTriggerData.length,
        };
    }
    return;
}
//#endregion

//#region get
/**
 * Retrieves a single timeline event from the database.
 *
 * @param id - The ID of the timeline event.
 * @returns The timeline event.
 */
export async function getTimelineEvent(id: string) {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id,
        },
        { selectionSet: selectionSet },
    );
    if (data === null) return null;
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ id, data });
    const event = validateEvent(data);
    return event;
}

/**
 * Retrieves all timeline events for a given assignment.
 *
 * @param assignmentId - The ID of the assignment.
 * @returns An array of timeline events.
 */
export async function getAssignmentTimelineEvents(assignmentId: string) {
    const { data, errors } = await client.models.EventAssignment.listByAssignmentId(
        {
            assignmentId,
        },
        {
            selectionSet: [
                "timelineEvent.id",
                "timelineEvent.timelineEventType",
                "timelineEvent.eventAssignmentAmount",
                "timelineEvent.eventTitle",
                "timelineEvent.eventTaskAmount",
                "timelineEvent.date",
                "timelineEvent.notes",
                "timelineEvent.parentEventId",
                "timelineEvent.isCompleted",

                // Event info
                "timelineEvent.info.*",
                // campaign info
                "timelineEvent.campaign.id",
                //assignment info
                "timelineEvent.assignments.*",
                "timelineEvent.assignments.assignment.id",
                "timelineEvent.assignments.assignment.isPlaceholder",
                "timelineEvent.assignments.assignment.placeholderName",
                "timelineEvent.assignments.assignment.influencer.id",
                "timelineEvent.assignments.assignment.influencer.firstName",
                "timelineEvent.assignments.assignment.influencer.lastName",
                //child events
                "timelineEvent.childEvents.id",
                "timelineEvent.childEvents.timelineEventType",
                "timelineEvent.parentEventId",
                //email triggers
                "timelineEvent.emailTriggers.*",
            ],
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data });
    const events: Event[] = data
        .map((x) => {
            try {
                return validateEvent(x.timelineEvent as RawEvent);
            } catch (e) {
                console.log({ x });
                throw e;
            }
        })
        .filter((event): event is Event => {
            if (event === null) {
                console.error("event is null", event);
                return false;
            }
            return true;
        });
    return events;
}

/**
 * Get all Timeline Events for a given campaign
 * @param campaignId - The ID of the campaign
 * @param verbose    - If true, logs additional information about the data validation process
 * @returns An array of Timeline Events
 */
interface GetCampaignTimelineEventsParams {
    campaignId: string;
    verbose?: boolean;
    filters?: { types?: Events.EventType[] };
}
export async function getCampaignTimelineEvents({
    campaignId,
    verbose,
    filters,
}: GetCampaignTimelineEventsParams) {
    // const { data, errors } = await client.models.TimelineEvent.list({
    //     filter: { campaignCampaignTimelineEventsId: { eq: campaignId } },
    //     //@ts-ignore
    //     selectionSet,
    // });
    if (verbose) console.log("getCampaignTimelineEvents", { campaignId });
    const eventTypeFilter = filters?.types
        ? { or: [...filters.types.map((type) => ({ timelineEventType: { eq: type.toString() } }))] }
        : {};
    let filter = {};
    if (eventTypeFilter.or) filter = { ...eventTypeFilter };

    // if (filters) {
    //     console.log("Filters", { filters, filter });
    // }
    const { data, errors } = await client.models.TimelineEvent.listByCampaign(
        {
            campaignId,
        },
        {
            filter,
            selectionSet: selectionSet,
        },
    );

    if (verbose) console.log({ campaignId, data });
    if (errors) throw new Error(JSON.stringify(errors));
    const events: Event[] = data
        .map((event) => validateEvent(event))
        .filter((event): event is Event => {
            if (event === null) {
                console.error("event is null", event);
                return false;
            }
            return true;
        });
    return events;
}
interface GetTimelineEventsByIdsParams {
    campaignId: string;
    eventIds: string[];
}
export async function getCampaignTimelineEventsByIds({
    campaignId,
    eventIds,
}: GetTimelineEventsByIdsParams) {
    // const { data, errors } = await client.models.TimelineEvent.list({
    //     filter: { campaignCampaignTimelineEventsId: { eq: campaignId } },
    //     //@ts-ignore
    //     selectionSet,
    // });
    const { data, errors } = await client.models.TimelineEvent.listByCampaign(
        {
            campaignId,
        },
        {
            filter: {
                or: eventIds.map((id) => ({ id: { eq: id } })),
            },
            selectionSet: selectionSet,
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    const events: Event[] = data
        .map((event) => validateEvent(event))
        .filter((event): event is Event => {
            if (event === null) {
                console.error("event is null", event);
                return false;
            }
            return true;
        });
    return events;
}

/**
 * Get Event for Email Trigger Routine
 * Includes additional data
 */

export async function getEventForEmailTrigger(eventId: string): Promise<
    Nullable<{
        event: Event | null;
        customer: Customer;
    }>
> {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: [
                ...selectionSet,
                //Campaign info
                "campaign.customers.*",
            ],
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    if (data === null) return null;
    const event = validateEvent(data);
    const campaign = data.campaign;
    const rawCustomer = campaign.customers[0];
    const customer: Customer = {
        id: rawCustomer.id,
        company: rawCustomer.company ?? "<Error>",
        firstName: rawCustomer.firstName ?? "<Error>",
        lastName: rawCustomer.lastName ?? "<Error>",
        email: rawCustomer.email ?? "<Error>",
        companyPosition: rawCustomer.companyPosition,
        notes: rawCustomer.notes,
    };

    return { event, customer };
}
//#endregion

//#region Connections
/**
 * Connects an event to an assignment in the database.
 *
 * @param timelineEventId - The ID of the timeline event.
 * @param assignmentId - The ID of the influencer assignment.
 * @returns An object containing the data and errors, if any.
 * @throws If there are any errors during the database operation.
 */
export async function connectToAssignment(timelineEventId: string, assignmentId: string) {
    const { data, errors } = await client.models.EventAssignment.create({
        timelineEventId: timelineEventId,
        assignmentId,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    return { data: JSON.parse(JSON.stringify(data)), errors };
}

/**
 * Disconnects an assignment from a timeline event.
 * @param eventId - The ID of the timeline event.
 * @param assignmentId - The ID of the assignment.
 * @throws {Error} If there are any errors during the disconnection process.
 */
export async function disconnectFromAssignment(eventId: string, assignmentId: string) {
    const { data, errors } = (await client.models.EventAssignment.list({
        filter: { timelineEventId: { eq: eventId }, assignmentId: { eq: assignmentId } },
        selectionSet: ["id"],
    })) as { data: { id: string }[]; errors: unknown };
    if (errors) throw new Error(JSON.stringify(errors));
    if (data.length === 0) return;
    const { errors: deleteErrors } = await client.models.EventAssignment.delete({
        id: data[0].id,
    });
    if (deleteErrors) throw new Error(JSON.stringify(deleteErrors));
}

/**
 *  Connects two events by leaving a reference to the parent event in the child event
 * @param parent    Parent Element: The event that should be referenced
 * @param child     Child Element: The event that should reference the parent
 * @throws          Error if no IDs are provided
 * @throws          Error if the update fails
 * @returns         void
 */
export async function connectEvents(
    parent: PartialWith<Event, "id">,
    child: PartialWith<Event, "id">,
): Promise<void> {
    if (!(parent.id && child.id)) throw new Error("No IDs provided");
    const { data, errors } = await client.models.TimelineEvent.update({
        id: child.id,
        parentEventId: parent.id,
    });
    if (errors) {
        throw new Error("Failed to update timeline event");
    }
    return;
}

//#endregion

//#region Validation
function validateEvent(rawEvent: Nullable<RawEvent>): Nullable<Event> {
    if (!rawEvent) {
        console.error("No Event Data", rawEvent);
        return null;
    }
    const {
        id,
        timelineEventType,
        campaign,
        assignments,
        childEvents: childEventsRaw,
        parentEventId,
    } = rawEvent;
    // console.log("timeline", { rawData, assignment: rawData.assignments[0] });
    // console.log("validating", rawData);
    if (!id) {
        console.error("Event has no ID", rawEvent);
        return null;
    }
    if (!Events.isTimelineEventType(timelineEventType)) {
        console.error("Invalid Type", rawEvent);
        return null;
    }

    const parentEvent: Event["parentEvent"] = parentEventId ? { id: parentEventId } : null;
    const childEvents: Event["childEvents"] = childEventsRaw.map((x) => {
        return { id: x.id, type: x.timelineEventType as Events.EventType };
    });

    const { date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = rawEvent;
    const validatedAssignments: Assignments.Min[] = assignments.map(({ assignment }) => {
        const assignmentOut: Assignments.Min = {
            id: assignment.id,
            isPlaceholder: assignment.isPlaceholder,
            placeholderName: assignment.placeholderName,
            influencer: assignment.influencer
                ? {
                      id: assignment.influencer.id,
                      firstName: assignment.influencer.firstName,
                      lastName: assignment.influencer.lastName,
                  }
                : null,
            timelineEvents: [],
            campaign: { id: campaign.id },
        };
        return assignmentOut;
    });
    const info: Partial<Event["info"]> = {
        topic: rawEvent.info?.topic ?? undefined,
        charLimit: rawEvent.info?.charLimit ?? undefined,
        draftDeadline: rawEvent.info?.draftDeadline ?? undefined,
        instructions: rawEvent.info?.instructions ?? undefined,
        maxDuration: rawEvent.info?.maxDuration ?? undefined,
        eventLink: rawEvent.info?.eventLink ?? undefined,
        eventPostContent: rawEvent.info?.eventPostContent ?? undefined,
    };
    const targetAudience: Event["targetAudience"] = {
        industry: rawEvent.targetAudience?.industry?.filter((x): x is string => x !== null) ?? [],
        country: rawEvent.targetAudience?.country?.filter((x): x is string => x !== null) ?? [],
        cities: rawEvent.targetAudience?.cities?.filter((x): x is string => x !== null) ?? [],
    };

    const eventStatus: Event["status"] = rawEvent.status ?? "WAITING_FOR_DRAFT";

    const eventOut: Event = {
        id,
        type: timelineEventType,
        date: date ?? undefined,
        notes,
        campaign: { id: campaign.id },
        assignments: validatedAssignments,
        eventAssignmentAmount: eventAssignmentAmount ?? 1,
        eventTitle: eventTitle ?? "",
        eventTaskAmount: eventTaskAmount ?? 0,
        parentEvent,
        childEvents,
        info,
        isCompleted: rawEvent.isCompleted ?? false,
        emailTriggers: rawEvent.emailTriggers.map((x) => ({
            id: x.id,
            type: x.type as EmailTriggers.emailTriggerType,
            event: { id },
            date: x.date,
            active: x.active,
            sent: x.sent,
        })),
        targetAudience,
        status: eventStatus,
    };
    return eventOut;
}

function validateArray(rawData: Nullable<RawEvent>[]): Event[] {
    return rawData.map(validateEvent).filter((event): event is Event => event !== null);
}
//#endregion
