"use server";

import { Nullable, PartialWith } from "@/app/Definitions/types";
import Assignment from "../types/assignment";
import Influencer from "../types/influencer";
import TimelineEvent from "../types/timelineEvents";
import client from "./.dbclient";
import { relative } from "path";

export async function dummy() {
    //@ts-ignore
    const { data, errors } = await client.models.TimelineEvent.list({
        //@ts-ignore
        selectionSet: [
            "id",
            "timelineEventType",
            "campaign.id",

            "eventAssignmentAmount",
            "eventTitle",
            "eventTaskAmount",

            "date",
            "notes",
            // "assignments.*",
            // "assignments.influencerAssignment.id",
            // "assignments.influencerAssignment.isPlaceholder",
            // "assignments.influencerAssignment.placeholderName",
            // "assignments.influencerAssignment.influencer.id",
            // "assignments.influencerAssignment.influencer.firstName",
            // "assignments.influencerAssignment.influencer.lastName",
            // "assignments.influencer.*",
            // "assignments.influencerassignment.*",
            // "assignments.influencerassignment.influencer.*",
            // "assignments.influencer.*",
            // "assignments.*",
        ],
    });
    return { JSON: JSON.stringify(data), errors };
}
const selectionSet = [
    "id",
    "timelineEventType",

    "campaign.id",

    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",

    "assignments.*",
    "assignments.influencerAssignment.id",
    "assignments.influencerAssignment.isPlaceholder",
    "assignments.influencerAssignment.placeholderName",
    "assignments.influencerAssignment.influencer.id",
    "assignments.influencerAssignment.influencer.firstName",
    "assignments.influencerAssignment.influencer.lastName",

    "date",
    "notes",
] as const;

type RawData = {
    id: string;
    timelineEventType: string;
    campaign: { id: string };
    assignments: {
        influencerAssignment: {
            id: string;
            isPlaceholder: boolean;
            placeholderName: string;
            influencer: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        };
    }[];
    eventAssignmentAmount: Nullable<number>;
    eventTitle: Nullable<string>;
    eventTaskAmount: Nullable<number>;
    date: Nullable<string>;
    notes: Nullable<string>;
};
function isRawData(data: unknown): data is RawData {
    const testData = data as RawData;
    // check with debug outputs
    // console.log("checking", { testData });

    if (!testData) {
        console.log("testData is falsy");
        return false;
    }
    // if (
    //     !(
    //         testData.id &&
    //         testData.timelineEventType &&
    //         testData.campaign &&
    //         testData.assignments &&
    //         testData.eventAssignmentAmount &&

    //     )
    // ) {
    //     console.log("missing data");
    //     return false;
    // }
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
            (typeof testData.eventAssignmentAmount === "number" || testData.eventAssignmentAmount === null) &&
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
                    typeof x.influencerAssignment.influencer.lastName === "string")
        )
    ) {
        console.log("invalid assignment data");
        return false;
    }

    return true;
}

// function validateEvent(rawData: SelectionSet<Schema["TimelineEvent"], typeof selectionSet>): TimelineEvent.Event { //
function validateEvent(rawData: RawData): TimelineEvent.Event {
    const { id, timelineEventType, campaign, assignments } = rawData;
    // console.log("timeline", { rawData, assignment: rawData.assignments[0] });
    if (!id) throw new Error("Missing ID");
    if (!TimelineEvent.isTimelineEventType(timelineEventType)) throw new Error("Invalid Type");
    //determine if the event is an multi-assignment event
    switch (true) {
        case TimelineEvent.isSingleEventType(timelineEventType): {
            const { date, notes } = rawData;
            const assignedInfluencer: Influencer.InfluencerWithName | null =
                assignments[0].influencerAssignment.influencer !== null
                    ? {
                          id: assignments[0].influencerAssignment.influencer.id,
                          firstName: assignments[0].influencerAssignment.influencer.firstName,
                          lastName: assignments[0].influencerAssignment.influencer.lastName,
                      }
                    : null;
            const assignment: Assignment.AssignmentMin = {
                id: assignments[0].influencerAssignment.id,
                isPlaceholder: assignments[0].influencerAssignment.isPlaceholder ?? false,
                placeholderName: assignments[0].influencerAssignment.placeholderName ?? null,
                influencer: assignedInfluencer,
            };
            const eventOut: TimelineEvent.SingleEvent = {
                id,
                type: timelineEventType,
                date: date ?? undefined,
                notes,
                campaign: { id: campaign.id },
                eventAssignmentAmount: 1,
                eventTaskAmount: rawData.eventTaskAmount ?? 0,
                eventTitle: rawData.eventTitle ?? "",
                assignment,
            };
            return eventOut;
        }
        case TimelineEvent.isMultiEventType(timelineEventType): {
            const { date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = rawData;
            const assignments: Assignment.AssignmentMin[] = rawData.assignments.map((x) => ({
                id: x.influencerAssignment.id,
                isPlaceholder: x.influencerAssignment.isPlaceholder,
                placeholderName: x.influencerAssignment.placeholderName,
                influencer: null,
            }));
            const eventOut: TimelineEvent.MultiEvent = {
                id,
                type: timelineEventType,
                date: date ?? undefined,
                notes,
                campaign: { id: campaign.id },
                assignments,
                eventAssignmentAmount: eventAssignmentAmount ?? 0,
                eventTitle: eventTitle ?? "",
                eventTaskAmount: eventTaskAmount ?? 0,
            };
            return eventOut;
        }
        default: {
            throw new Error("Invalid Event Type");
        }
    }
}

export async function listTimelineEvents(): Promise<TimelineEvent.Event[]> {
    //@ts-ignore
    const { data, errors } = await client.models.TimelineEvent.list({
        //@ts-ignore
        selectionSet,
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

export async function createTimelineEvent(props: TimelineEvent.Event) {
    // console.log(props);
    const { type: timelineEventType, date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;

    switch (true) {
        case TimelineEvent.isSingleEventType(timelineEventType): {
            const { assignment } = props;
            if (!(assignment && date && campaignCampaignTimelineEventsId)) {
                console.log({
                    assignment,
                    date,
                    campaignCampaignTimelineEventsId,
                    props,
                });
                throw new Error("Missing Data");
            }
            const { data, errors } = await client.models.TimelineEvent.create(
                {
                    timelineEventType,
                    date,
                    notes,
                    campaignCampaignTimelineEventsId,
                    eventAssignmentAmount,
                    eventTitle,
                    eventTaskAmount,
                },
                {}
            );
            if (errors) throw new Error(JSON.stringify(errors));
            const { data: connectionData, errors: connectionErrors } = await connectToAssignment(
                data.id,
                assignment.id
            );
            if (connectionErrors) throw new Error(JSON.stringify(connectionErrors));
            // console.log(data);
            return data.id;
        }
        case TimelineEvent.isMultiEventType(timelineEventType): {
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
                },
                {}
            );
            //create join table entries
            const assignments = props.assignments ?? [];
            console.log("assignments", assignments);
            const connectionResponse = await Promise.all(
                assignments.map(async (assignment) => {
                    return await connectToAssignment(data.id, assignment.id);
                })
            );
            const connectionData = connectionResponse.map((x) => x.data);
            const connectionErrors = connectionResponse.map((x) => x.errors);
            console.log({ connectionData, connectionErrors });
            if (errors) throw new Error(JSON.stringify(errors));
            if (connectionErrors.length > 0) throw new Error(JSON.stringify(connectionErrors));
            console.log(data);
            return data.id;
        }
        default: {
            throw new Error("Invalid Event Type");
        }
    }
    // if (!(influencerAssignmentTimelineEventsId && date && campaignCampaignTimelineEventsId)) {
    //     console.log({
    //         influencerAssignmentTimelineEventsId,
    //         date,
    //         campaignCampaignTimelineEventsId,
    //         props,
    //     });
    //     throw new Error("Missing Data");
    // }

    // const { data, errors } = await client.models.TimelineEvent.create(
    //     {
    //         timelineEventType,
    //         date,
    //         campaignCampaignTimelineEventsId,
    //         influencerAssignmentTimelineEventsId,
    //         notes,
    //     },
    //     {},
    // );
    // console.log(data);

    // return data.id;
}
export async function updateTimelineEvent(props: Partial<TimelineEvent.Event>) {
    const { id, type: timelineEventType, date, notes } = props;
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
    });
    if (errors) throw new Error(JSON.stringify(errors));
    // console.log({ data, errors });
}
export async function deleteTimelineEvent(event: PartialWith<TimelineEvent.Event, "id">) {
    if (!event.id) throw new Error("Missing Data");

    //find and delete all connections
    //@ts-ignore
    const { data: connectionData, errors: connectionErrors } = await client.models.EventAssignments.list({
        // @ts-ignore
        selectionSet: ["id"],
        filter: { timelineEventId: { eq: event.id } },
    });
    // console.log("connections", { connectionData, connectionErrors });

    const connectionDeleteResponse = await Promise.all(
        connectionData.map(async (x: unknown) => {
            console.log({ connection: x });
            const connection = x as { id: string };
            return client.models.EventAssignments.delete({ id: connection.id });
        })
    );

    const { errors } = await client.models.TimelineEvent.delete({ id: event.id });
    if (errors) throw new Error(JSON.stringify(errors));
    console.log(errors);
}

export async function getTimelineEvent(id: string) {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id,
        },
        //@ts-ignore
        { selectionSet }
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
 */
export async function getAssignmentTimelineEvents(assignmentId: string) {
    const { data, errors } = await client.models.EventAssignments.list({
        filter: { influencerAssignmentId: { eq: assignmentId } },
        //@ts-ignore
        selectionSet: [...selectionSet.map((x) => `timelineEvent.${x}`)],
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
 * @returns An array of Timeline Events
 */
export async function getCampaignTimelineEvents(campaignId: string, verbose = false) {
    // const { data, errors } = await client.models.TimelineEvent.list({
    //     filter: { campaignCampaignTimelineEventsId: { eq: campaignId } },
    //     //@ts-ignore
    //     selectionSet,
    // });
    if (verbose) console.log("getCampaignTimelineEvents", { campaignId });
    const { data, errors } = await client.models.TimelineEvent.listByCampaignCampaignTimelineEventsId(
        {
            campaignCampaignTimelineEventsId: campaignId,
        },
        {
            //@ts-ignore
            selectionSet,
        }
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

export async function connectToAssignment(eventId: string, assignmentId: string) {
    return client.models.EventAssignments.create({
        timelineEventId: eventId,
        influencerAssignmentId: assignmentId,
    });
}
