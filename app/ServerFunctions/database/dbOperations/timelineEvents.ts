"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import client from "./.dbclient";
import { emailTriggers } from ".";
import dayjs from "@/app/utils/configuredDayJs";
import { EmailTriggers } from "../../types/emailTriggers";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import Customer from "../../types/customer";

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

            //related events
            "relatedEvents.id",
            "parentEventId",
        ],
    });
    return { data: JSON.parse(JSON.stringify(data)), errors };
}
const selectionSetFull = [
    //Event info
    "id",
    "timelineEventType",
    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",
    "date",
    "notes",
    "info.*",

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

    //related events
    "relatedEvents.id",
    "relatedEvents.timelineEventType",
    "parentEventId",

    //email triggers
    "emailTriggers.*",

    //target audience
    "targetAudience.*",
] as const;
type RawEvent = SelectionSet<Schema["TimelineEvent"], typeof selectionSetFull>;

const selectionSetMin = ["id", "timelineEventType", "campaign.id"] as const;

// function validateEvent(rawData: SelectionSet<Schema["TimelineEvent"], typeof selectionSet>): TimelineEvent.Event { //
function validateEvent(rawEvent: RawEvent): TimelineEvent.Event {
    const { id, timelineEventType, campaign, assignments, relatedEvents, parentEventId } = rawEvent;
    // console.log("timeline", { rawData, assignment: rawData.assignments[0] });
    // console.log("validating", rawData);
    if (!id) throw new Error("Missing ID");
    if (!TimelineEvent.isTimelineEventType(timelineEventType)) throw new Error("Invalid Type");

    const relatedEventsParsed: TimelineEvent.Event["relatedEvents"] = {
        parentEvent: parentEventId ? { id: parentEventId } : null,
        childEvents: relatedEvents.map((x) => {
            return { id: x.id, type: x.timelineEventType as TimelineEvent.eventType };
        }),
    };

    const { date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = rawEvent;
    const validatedAssignments: Assignment.AssignmentMin[] = assignments.map(({ assignment }) => {
        const assignmentOut: Assignment.AssignmentMin = {
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
    const info: Partial<TimelineEvent.Event["info"]> = {
        topic: rawEvent.info?.topic ?? undefined,
        charLimit: rawEvent.info?.charLimit ?? undefined,
        draftDeadline: rawEvent.info?.draftDeadline ?? undefined,
        instructions: rawEvent.info?.instructions ?? undefined,
        maxDuration: rawEvent.info?.maxDuration ?? undefined,
    };
    const targetAudience: TimelineEvent.Event["targetAudience"] = {
        industry: rawEvent.targetAudience?.industry?.filter((x): x is string => x !== null) ?? [],
        country: rawEvent.targetAudience?.country?.filter((x): x is string => x !== null) ?? [],
        cities: rawEvent.targetAudience?.cities?.filter((x): x is string => x !== null) ?? [],
    };

    const eventOut: TimelineEvent.Event = {
        id,
        type: timelineEventType,
        date: date ?? undefined,
        notes,
        campaign: { id: campaign.id },
        assignments: validatedAssignments,
        eventAssignmentAmount: eventAssignmentAmount ?? 1,
        eventTitle: eventTitle ?? "",
        eventTaskAmount: eventTaskAmount ?? 0,
        relatedEvents: relatedEventsParsed,
        info,
        emailTriggers: rawEvent.emailTriggers.map((x) => ({
            id: x.id,
            type: x.type as EmailTriggers.emailTriggerType,
            event: { id },
            date: x.date,
            active: x.active,
            sent: x.sent,
        })),
        targetAudience,
    };
    return eventOut;
}

export async function listTimelineEvents(): Promise<TimelineEvent.Event[]> {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet: selectionSetFull,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log("timeline", { data });
    const events: TimelineEvent.Event[] = data.map((event) => {
        const validatedEvent = validateEvent(event);
        return validatedEvent;
    });
    return events;
}

/**
 * Creates a new timeline event in the database.
 * @param props - The properties of the timeline event to create.
 * @returns The ID of the created timeline event.
 * @throws {Error} If any required data is missing or if there are any errors during the creation.
 */
export async function createTimelineEvent(props: Omit<TimelineEvent.Event, "id">) {
    // console.log(props);
    const {
        type: timelineEventType,
        date,
        notes,
        eventAssignmentAmount,
        eventTitle,
        eventTaskAmount,
        info,
        relatedEvents: { parentEvent },
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
        },
        {}
    );
    //create join table entries
    const assignments = props.assignments ?? [];
    // console.log("assignments", assignments);
    const connectionResponse = await Promise.all(
        assignments.map(async (assignment) => {
            return await connectToAssignment(data.id, assignment.id);
        })
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

/**
 * Updates a timeline event with the provided properties.
 * @param props - The properties to update the timeline event with.
 * @returns - Promise that resolves when the timeline event is updated successfully.
 * @throws - Error if any required data is missing or if there are any errors during the update.
 */
export async function updateTimelineEvent(props: PartialWith<TimelineEvent.Event, "id">) {
    const {
        id,
        type: timelineEventType,
        campaign: { id: campaignId } = {},
        date,
        notes,
        info,
        eventAssignmentAmount,
        eventTaskAmount,
        eventTitle,
        relatedEvents,
        targetAudience,
    } = props;
    if (!id) {
        throw new Error("Missing Data");
    }
    const newEvent = {
        id: id,
        ...(date ? { date: date } : {}),
        ...(notes ? { notes: notes } : {}),
        ...(timelineEventType ? { timelineEventType: timelineEventType } : {}),
        ...(campaignId ? { campaignId: campaignId } : {}),
        ...(eventAssignmentAmount ? { eventAssignmentAmount: eventAssignmentAmount } : {}),
        ...(eventTaskAmount ? { eventTaskAmount: eventTaskAmount } : {}),
        ...(eventTitle ? { eventTitle: eventTitle } : {}),
        ...(info ? { info: info } : {}),
        ...(targetAudience ? { targetAudience: targetAudience } : {}),
    } satisfies PartialWith<Schema["TimelineEvent"], "id">;

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
    const { data, errors } = await client.models.TimelineEvent.update(newEvent);
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data, errors });
}
/**
 * Deletes a timeline event from the database.
 * @param event - The event to delete.
 * @throws {Error} If the event does not have an ID.
 * @throws {Error} If there are any errors during the database operation.
 * @returns void
 */
export async function deleteTimelineEvent(event: PartialWith<TimelineEvent.Event, "id">) {
    if (!event.id) throw new Error("Missing Data");

    //find and delete all connections
    const { data: connectionData, errors: connectionErrors } = await client.models.EventAssignment.list({
        selectionSet: ["id"],
        filter: { timelineEventId: { eq: event.id } },
    });
    // console.log("connections", { connectionData, connectionErrors });

    const connectionDeleteResponse = await Promise.all(
        connectionData.map(async (x: unknown) => {
            console.log({ connection: x });
            const connection = x as { id: string };
            return client.models.EventAssignment.delete({ id: connection.id });
        })
    );

    const { errors } = await client.models.TimelineEvent.delete({ id: event.id });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log(errors);
}

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
        { selectionSet: selectionSetFull }
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
                //related events
                "timelineEvent.relatedEvents.id",
                "timelineEvent.relatedEvents.timelineEventType",
                "timelineEvent.parentEventId",
                //email triggers
                "timelineEvent.emailTriggers.*",
            ],
        }
    );
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data });
    const events: TimelineEvent.Event[] = data.map((x) => {
        try {
            return validateEvent(x.timelineEvent as RawEvent);
        } catch (e) {
            console.log({ x });
            throw e;
        }
    });
    return events;
}

/**
 * Get all Timeline Events for a given campaign
 * @param campaignId - The ID of the campaign
 * @param verbose    - If true, logs additional information about the data validation process
 * @returns An array of Timeline Events
 */
export async function getCampaignTimelineEvents(campaignId: string, verbose = false) {
    // const { data, errors } = await client.models.TimelineEvent.list({
    //     filter: { campaignCampaignTimelineEventsId: { eq: campaignId } },
    //     //@ts-ignore
    //     selectionSet,
    // });
    if (verbose) console.log("getCampaignTimelineEvents", { campaignId });
    const { data, errors } = await client.models.TimelineEvent.listByCampaign(
        {
            campaignId,
        },
        {
            selectionSet: selectionSetFull,
        }
    );

    if (verbose) console.log({ campaignId, data });
    if (errors) throw new Error(JSON.stringify(errors));
    const events: TimelineEvent.Event[] = data.map((event) => validateEvent(event));
    return events;
}

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
    parent: PartialWith<TimelineEvent.Event, "id">,
    child: PartialWith<TimelineEvent.Event, "id">
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

/**
 * Get Event for Email Trigger Routine
 * Includes additional data
 */

export async function getEventForEmailTrigger(eventId: string): Promise<
    Nullable<{
        event: TimelineEvent.Event | null;
        customer: Customer.Customer;
    }>
> {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: [
                ...selectionSetFull,
                //Campaign info
                "campaign.customers.*",
            ],
        }
    );
    if (errors) throw new Error(JSON.stringify(errors));
    if (data === null) return null;
    const event = validateEvent(data);
    const campaign = data.campaign;
    const customer = campaign.customers[0];

    return { event, customer };
}
