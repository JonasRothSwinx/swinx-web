"use server";

import { PartialWith } from "@/app/Definitions/types";
import TimelineEvent from "../types/timelineEvents";
import client from "./.dbclient";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import Assignment from "../types/assignment";

export async function dummy() {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet: [
            "id",
            "timelineEventType",
            "campaign.id",
            "assignments.*",
            "eventAssignmentAmount",
            "eventTitle",
            "eventTaskAmount",
            "date",
            "notes",
            "assignments.influencerassignment.id",
            "assignments.*",
        ],
    });
    return { JSON: JSON.stringify(data), errors };
}
const selectionSet = [
    "id",
    "timelineEventType",

    "campaign.id",
    "assignments.*",

    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",

    "date",
    "notes",
] as const;

function validateEvent(
    rawData: SelectionSet<Schema["TimelineEvent"], typeof selectionSet>,
): TimelineEvent.Event {
    const { id, timelineEventType, campaign } = rawData;
    if (!id) throw new Error("Missing ID");
    if (!TimelineEvent.isTimelineEventType(timelineEventType)) throw new Error("Invalid Type");
    //determine if the event is an multi-assignment event
    switch (true) {
        case TimelineEvent.isSingleEventType(timelineEventType): {
            const { date, notes, assignments } = rawData;
            const eventOut: TimelineEvent.SingleEvent = {
                id,
                type: timelineEventType,
                date: date ?? undefined,
                notes,
                campaign: { id: campaign.id },
                eventAssignmentAmount: 1,
                eventTaskAmount: rawData.eventTaskAmount ?? 0,
                assignment: {
                    id: assignments[0].id,
                    isPlaceholder: assignments[0].isPlaceholder ?? false,
                    placeholderName: assignments[0].placeholderName ?? null,
                    influencer: assignments[0].influencer ?? null,
                } satisfies Assignment.AssignmentMin,
            };
            return eventOut;
        }
        case TimelineEvent.isMultiEventType(timelineEventType): {
            const { date, notes, eventAssignmentAmount, eventTitle, eventTaskAmount } = rawData;
            const assignments: Assignment.AssignmentMin[] = rawData.assignments.map((x) => ({
                id: x.id,
                isPlaceholder: x.isPlaceholder,
                placeholderName: x.placeholderName,
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
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet,
    });
    const events: TimelineEvent.Event[] = data.map((event) => {
        const type = event.timelineEventType;
        if (!TimelineEvent.isTimelineEventType(type)) throw new Error("Invalid Event Type");
        const validatedEvent = validateEvent(event);
        return validatedEvent;
    });
    return events;
}
export async function createTimelineEvent(props: TimelineEvent.Event) {
    // console.log(props);
    const { type: timelineEventType, date, notes } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;

    switch (true) {
        case TimelineEvent.isSingleEventType(timelineEventType): {
            if (
                !(influencerAssignmentTimelineEventsId && date && campaignCampaignTimelineEventsId)
            ) {
                console.log({
                    influencerAssignmentTimelineEventsId,
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
                },
                {},
            );
            console.log(data);
            return data.id;
        }
        case TimelineEvent.isMultiEventType(timelineEventType): {
            if (!(date && campaignCampaignTimelineEventsId)) {
                throw new Error("Missing Data");
            }
            const { data, errors } = await client.models.TimelineEvent.create(
                {
                    timelineEventType,
                    date,
                    campaignCampaignTimelineEventsId,
                    notes,
                },
                {},
            );
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
    const { id: influencerAssignmentTimelineEventsId } = props.assignment ?? {};
    if (!(id && timelineEventType && date && campaignCampaignTimelineEventsId)) {
        throw new Error("Missing Data");
    }

    const { data, errors } = await client.models.TimelineEvent.update({
        id,
        timelineEventType,
        date,
        campaignCampaignTimelineEventsId,
        influencerAssignmentTimelineEventsId,
        notes,
    });
    console.log({ data, errors });
}
export async function deleteTimelineEvent(event: TimelineEvent.Event) {
    if (!event.id) throw new Error("Missing Data");

    const { errors } = await client.models.TimelineEvent.delete({ id: event.id });
    console.log(errors);
}

// async function createInviteEvent(props: TimelineEvent.InviteEvent | undefined) {
//     if (props === undefined) return { data: undefined, errors: undefined };
//     const { invites } = props;
//     if (!invites) {
//         throw new Error("Missing Data");
//     }

//     const { data, errors } = await client.models.InvitesEvent.create({
//         invites,
//     });
//     return { data, errors };
// }
// async function updateInviteEvent(props: PartialWith<TimelineEvent.InviteEvent, "id">) {
//     if (props === undefined) return { data: undefined, errors: undefined };
//     const { invites, id } = props;
//     if (!(invites && id)) {
//         throw new Error("Missing Data");
//     }
//     const updatedData: TimelineEvent.InviteEvent = { id: id, invites };

//     const { data, errors } = await client.models.InvitesEvent.update({ id, invites }, {});
//     return { data, errors };
// }

/**
 * Retrieves all timeline events for a given assignment.
 */
export async function getAssignmentTimelineEvents(assignmentId: string) {
    const { data, errors } = await client.models.TimelineEvent.list({
        filter: { influencerAssignmentTimelineEventsId: { eq: assignmentId } },
        selectionSet,
    });
    if (errors) throw new Error(JSON.stringify(errors));
    const events: TimelineEvent.Event[] = data.map(validateEvent);
    return events;
}
