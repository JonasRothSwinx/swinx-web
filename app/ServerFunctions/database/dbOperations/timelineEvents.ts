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
] as const;
type RawEvent = SelectionSet<Schema["TimelineEvent"], typeof selectionSetFull>;

const selectionSetMin = ["id", "timelineEventType", "campaign.id"] as const;

// function isRawData(data: unknown): data is RawData.RawTimeLineEventFull {
//     const testData = data as RawData.RawTimeLineEventFull;
//     // check with debug outputs
//     // console.log("checking", { testData });

//     if (!testData) {
//         console.log("testData is falsy");
//         return false;
//     }
//     //check required data types
//     if (
//         !(
//             typeof testData.id === "string" &&
//             typeof testData.timelineEventType === "string" &&
//             typeof testData.campaign.id === "string" &&
//             Array.isArray(testData.assignments)
//         )
//     ) {
//         console.log("invalid data types");
//         return false;
//     }
//     //check nullable data types
//     if (
//         !(
//             (typeof testData.eventAssignmentAmount === "number" ||
//                 testData.eventAssignmentAmount === null) &&
//             (typeof testData.eventTitle === "string" || testData.eventTitle === null) &&
//             (typeof testData.eventTaskAmount === "number" || testData.eventTaskAmount === null) &&
//             (typeof testData.date === "string" || testData.date === null) &&
//             (typeof testData.notes === "string" || testData.notes === null)
//         )
//     ) {
//         console.log("invalid nullable data types");
//         return false;
//     }
//     if (
//         !testData.assignments.every(
//             (x) =>
//                 (x.influencerAssignment &&
//                     x.influencerAssignment.id &&
//                     typeof x.influencerAssignment.id === "string" &&
//                     typeof x.influencerAssignment.isPlaceholder === "boolean" &&
//                     typeof x.influencerAssignment.placeholderName === "string" &&
//                     x.influencerAssignment.influencer === null) ||
//                 (x.influencerAssignment.influencer &&
//                     x.influencerAssignment.influencer.id &&
//                     typeof x.influencerAssignment.influencer.id === "string" &&
//                     typeof x.influencerAssignment.influencer.firstName === "string" &&
//                     typeof x.influencerAssignment.influencer.lastName === "string"),
//         )
//     ) {
//         console.log("invalid assignment data");
//         return false;
//     }

//     return true;
// }

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
    const validatedAssignments: Assignment.AssignmentMin[] = assignments.map(({ assignment }) => ({
        id: assignment.id,
        isPlaceholder: assignment.isPlaceholder,
        placeholderName: assignment.placeholderName,
        campaign: { id: campaign.id },
        influencer: null,
        timelineEvents: [],
    }));
    const info: Partial<TimelineEvent.Event["info"]> = {
        topic: rawEvent.info?.topic ?? undefined,
        charLimit: rawEvent.info?.charLimit ?? undefined,
        draftDeadline: rawEvent.info?.draftDeadline ?? undefined,
        instructions: rawEvent.info?.instructions ?? undefined,
        maxDuration: rawEvent.info?.maxDuration ?? undefined,
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
        })),
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
    } = props;
    const { id: campaignId } = props.campaign;
    if (!(date && campaignId)) {
        throw new Error("Missing Data");
    }
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
        },
        {},
    );
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

/**
 * Updates a timeline event with the provided properties.
 * @param props - The properties to update the timeline event with.
 * @returns - Promise that resolves when the timeline event is updated successfully.
 * @throws - Error if any required data is missing or if there are any errors during the update.
 */
export async function updateTimelineEvent(props: Partial<TimelineEvent.Event>) {
    const { id, type: timelineEventType, date, notes, info } = props;
    const { id: campaignId } = props.campaign ?? {};
    if (!(id && timelineEventType && date && campaignId)) {
        throw new Error("Missing Data");
    }

    const { data, errors } = await client.models.TimelineEvent.update({
        id,
        timelineEventType,
        date,
        campaignId,
        notes,
        info: info,
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
        await client.models.EventAssignment.list({
            selectionSet: ["id"],
            filter: { timelineEventId: { eq: event.id } },
        });
    // console.log("connections", { connectionData, connectionErrors });

    const connectionDeleteResponse = await Promise.all(
        connectionData.map(async (x: unknown) => {
            console.log({ connection: x });
            const connection = x as { id: string };
            return client.models.EventAssignment.delete({ id: connection.id });
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
        { selectionSet: selectionSetFull },
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
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data });
    type infoorig = RawEvent["info"];
    const infovalue = data[0].timelineEvent.info;
    type info = typeof infovalue;
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
    const { data, errors } = await client.models.TimelineEvent.listByCampaignId(
        {
            campaignId,
        },
        {
            selectionSet: selectionSetFull,
        },
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
    child: PartialWith<TimelineEvent.Event, "id">,
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
