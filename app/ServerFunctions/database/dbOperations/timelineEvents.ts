/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import client from "./.dbclient";
import { RawData } from "./types";

export async function dummy() {
    //@ts-expect-error - type instantiation error
    const { data, errors } = await client.models.TimelineEvent.list({
        //@ts-ignore
        selectionSet: [
            //Event details
            "id",
            "timelineEventType",
            "eventAssignmentAmount",
            "eventTitle",
            "eventTaskAmount",
            "date",
            "notes",
            "details.*",

            //campaign details
            "campaign.id",

            //assignment details
            "assignments.*",
            //@ts-ignore
            "assignments.influencerAssignment.id",
            //@ts-ignore
            "assignments.influencerAssignment.isPlaceholder",
            //@ts-ignore
            "assignments.influencerAssignment.placeholderName",
            //@ts-ignore
            "assignments.influencerAssignment.influencer.id",
            //@ts-ignore
            "assignments.influencerAssignment.influencer.firstName",
            //@ts-ignore
            "assignments.influencerAssignment.influencer.lastName",

            // "assignments.influencerAssignment.id",

            "assignments.influencerassignment.id",

            //related events
            "relatedEvents.id",
            "timelineEventRelatedEventsId",
        ],
    });
    return { data: JSON.parse(JSON.stringify(data)), errors };
}
const selectionSetFull = [
    //Event details
    "id",
    "timelineEventType",
    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",
    "date",
    "notes",
    "details.*",

    //campaign details
    "campaign.id",

    //assignment details
    "assignments.*",
    "assignments.influencerAssignment.id",
    "assignments.influencerAssignment.isPlaceholder",
    "assignments.influencerAssignment.placeholderName",
    "assignments.influencerAssignment.influencer.id",
    "assignments.influencerAssignment.influencer.firstName",
    "assignments.influencerAssignment.influencer.lastName",

    //related events
    "relatedEvents.id",
    "relatedEvents.timelineEventType",
    "timelineEventRelatedEventsId",
] as const;

const selectionSetMin = ["id", "timelineEventType", "campaign.id"] as const;

function isRawData(data: unknown): data is RawData.RawTimeLineEventFull {
    const testData = data as RawData.RawTimeLineEventFull;
    // check with debug outputs
    // console.log("checking", { testData });

    if (!testData) {
        console.log("testData is falsy");
        return false;
    }
    //check required data types
    if (
        !(
            typeof testData.id === "string" &&
            typeof testData.timelineEventType === "string" &&
            typeof testData.campaign.id === "string" &&
            Array.isArray(testData.assignments)
        )
    ) {
        console.log("invalid data types");
        return false;
    }
    //check nullable data types
    if (
        !(
            (typeof testData.eventAssignmentAmount === "number" ||
                testData.eventAssignmentAmount === null) &&
            (typeof testData.eventTitle === "string" || testData.eventTitle === null) &&
            (typeof testData.eventTaskAmount === "number" || testData.eventTaskAmount === null) &&
            (typeof testData.date === "string" || testData.date === null) &&
            (typeof testData.notes === "string" || testData.notes === null)
        )
    ) {
        console.log("invalid nullable data types");
        return false;
    }
    if (
        !testData.assignments.every(
            (x) =>
                (x.influencerAssignment &&
                    x.influencerAssignment.id &&
                    typeof x.influencerAssignment.id === "string" &&
                    typeof x.influencerAssignment.isPlaceholder === "boolean" &&
                    typeof x.influencerAssignment.placeholderName === "string" &&
                    x.influencerAssignment.influencer === null) ||
                (x.influencerAssignment.influencer &&
                    x.influencerAssignment.influencer.id &&
                    typeof x.influencerAssignment.influencer.id === "string" &&
                    typeof x.influencerAssignment.influencer.firstName === "string" &&
                    typeof x.influencerAssignment.influencer.lastName === "string"),
        )
    ) {
        console.log("invalid assignment data");
        return false;
    }

    return true;
}

// function validateEvent(rawData: SelectionSet<Schema["TimelineEvent"], typeof selectionSet>): TimelineEvent.Event { //
function validateEvent(rawData: RawData.RawTimeLineEventFull): TimelineEvent.Event {
    const { id, timelineEventType, campaign, assignments, relatedEvents } = rawData;
    // console.log("timeline", { rawData, assignment: rawData.assignments[0] });
    // console.log("validating", rawData);
    if (!id) throw new Error("Missing ID");
    if (!TimelineEvent.isTimelineEventType(timelineEventType)) throw new Error("Invalid Type");

    const relatedEventsParsed = {
        parentEvent:
            rawData.timelineEventRelatedEventsId !== null
                ? { id: rawData.timelineEventRelatedEventsId }
                : null,
        childEvents: relatedEvents.map((x) => {
            return { id: x.id, type: x.timelineEventType as TimelineEvent.eventType };
        }),
    };

    const { date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = rawData;
    const validatedAssignments: Assignment.AssignmentMin[] = assignments.map((x) => ({
        id: x.influencerAssignment.id,
        isPlaceholder: x.influencerAssignment.isPlaceholder,
        placeholderName: x.influencerAssignment.placeholderName,
        campaign: { id: campaign.id },
        influencer: null,
        timelineEvents: [],
    }));
    const details: Partial<TimelineEvent.Event["details"]> = {
        topic: rawData.details?.topic ?? undefined,
        charLimit: rawData.details?.charLimit ?? undefined,
        draftDeadline: rawData.details?.draftDeadline ?? undefined,
        instructions: rawData.details?.instructions ?? undefined,
        maxDuration: rawData.details?.maxDuration ?? undefined,
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
        details,
    };
    return eventOut;
}

export async function listTimelineEvents(): Promise<TimelineEvent.Event[]> {
    const { data, errors } = await client.models.TimelineEvent.list({
        //@ts-expect-error - type instantiation error
        selectionSet: selectionSetFull,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log("timeline", { data });
    const events: TimelineEvent.Event[] = data.map((event: unknown) => {
        if (!isRawData(event)) throw new Error("Invalid Data");

        const type = event.timelineEventType;
        if (!TimelineEvent.isTimelineEventType(type)) throw new Error("Invalid Event Type");
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
        details,
    } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;
    if (!(date && campaignCampaignTimelineEventsId)) {
        throw new Error("Missing Data");
    }
    console.log("creating multiEvent", { props });
    const { data, errors } = await client.models.TimelineEvent.create(
        {
            timelineEventType,
            date,
            campaignCampaignTimelineEventsId,
            notes,
            eventAssignmentAmount,
            eventTitle,
            eventTaskAmount,
            details,
        },
        {},
    );
    //create join table entries
    const assignments = props.assignments ?? [];
    console.log("assignments", assignments);
    const connectionResponse = await Promise.all(
        assignments.map(async (assignment) => {
            return await connectToAssignment(data.id, assignment.id);
        }),
    );
    const connectionData = connectionResponse.map((x) => x.data);
    const connectionErrors = connectionResponse.map((x) => x.errors);
    console.log({ connectionData, connectionErrors });
    if (errors) throw new Error(JSON.stringify(errors));
    if (connectionErrors.length > 0 && connectionErrors.some((x) => x !== null && x !== undefined))
        throw new Error(JSON.stringify(connectionErrors));
    console.log(data);
    return data.id;
}

/**
 * Updates a timeline event with the provided properties.
 * @param props - The properties to update the timeline event with.
 * @returns - Promise that resolves when the timeline event is updated successfully.
 * @throws - Error if any required data is missing or if there are any errors during the update.
 */
export async function updateTimelineEvent(props: Partial<TimelineEvent.Event>) {
    const { id, type: timelineEventType, date, notes, details } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign ?? {};
    if (!(id && timelineEventType && date && campaignCampaignTimelineEventsId)) {
        throw new Error("Missing Data");
    }

    const { data, errors } = await client.models.TimelineEvent.update({
        id,
        timelineEventType,
        date,
        campaignCampaignTimelineEventsId,
        notes,
        details,
    });
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
    const { data: connectionData, errors: connectionErrors } =
        // @ts-expect-error - type instantiation error
        await client.models.EventAssignments.list({
            //@ts-expect-error - id exists
            selectionSet: ["id"],
            filter: { timelineEventId: { eq: event.id } },
        });
    // console.log("connections", { connectionData, connectionErrors });

    const connectionDeleteResponse = await Promise.all(
        connectionData.map(async (x: unknown) => {
            console.log({ connection: x });
            const connection = x as { id: string };
            return client.models.EventAssignments.delete({ id: connection.id });
        }),
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
        //@ts-ignore
        { selectionSet: selectionSetFull },
    );
    if (data === null) return null;
    if (errors) throw new Error(JSON.stringify(errors));
    if (!isRawData(data)) {
        console.log({ data });
        throw new Error("Invalid Data");
    }
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
    const { data, errors } = await client.models.EventAssignments.list({
        filter: { influencerAssignmentId: { eq: assignmentId } },
        //@ts-ignore
        selectionSet: [...selectionSetFull.map((x) => `timelineEvent.${x}`)],
    });
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data });
    const events: TimelineEvent.Event[] = data.map((event: unknown) => {
        const castEvent = event as { timelineEvent: unknown };
        if (!isRawData(castEvent.timelineEvent)) throw new Error("Invalid Data");
        const validatedEvent = validateEvent(castEvent.timelineEvent);
        return validatedEvent;
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
    const { data, errors } =
        await client.models.TimelineEvent.listByCampaignCampaignTimelineEventsId(
            {
                campaignCampaignTimelineEventsId: campaignId,
            },
            {
                //@ts-ignore
                selectionSet: selectionSetFull,
            },
        );

    if (verbose) console.log({ campaignId, data });
    if (errors) throw new Error(JSON.stringify(errors));
    const events: TimelineEvent.Event[] = data.map((event: unknown) => {
        if (!isRawData(event)) throw new Error("Invalid Data");
        const validatedEvent = validateEvent(event);
        return validatedEvent;
    });
    return events;
}

/**
 * Connects an event to an assignment in the database.
 *
 * @param eventId - The ID of the timeline event.
 * @param assignmentId - The ID of the influencer assignment.
 * @returns An object containing the data and errors, if any.
 * @throws If there are any errors during the database operation.
 */
export async function connectToAssignment(eventId: string, assignmentId: string) {
    const { data, errors } = await client.models.EventAssignments.create({
        timelineEventId: eventId,
        influencerAssignmentId: assignmentId,
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
    const { data, errors } = (await client.models.EventAssignments.list({
        filter: { timelineEventId: { eq: eventId }, influencerAssignmentId: { eq: assignmentId } },
        //@ts-ignore
        selectionSet: ["id"],
    })) as { data: { id: string }[]; errors: unknown };
    if (errors) throw new Error(JSON.stringify(errors));
    if (data.length === 0) return;
    const { errors: deleteErrors } = await client.models.EventAssignments.delete({
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
    child: PartialWith<TimelineEvent.Event, "id">,
): Promise<void> {
    if (!(parent.id && child.id)) throw new Error("No IDs provided");
    const { data, errors } = await client.models.TimelineEvent.update({
        id: child.id,
        timelineEventRelatedEventsId: parent.id,
    });
    if (errors) {
        throw new Error("Failed to update timeline event");
    }
    return;
}
