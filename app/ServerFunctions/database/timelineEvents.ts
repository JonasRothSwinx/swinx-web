/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import TimelineEvent from "../types/timelineEvents";
import client from "./.dbclient";

const selectionSet = [
    "id",
    "timelineEventType",

    "campaign.id",
    "assignment.*",
    "assignment.influencer.id",
    "assignment.influencer.firstName",
    "assignment.influencer.lastName",
    "influencerAssignmentTimelineEventsId",
    "inviteEvent.invites",
    // "webinarEvent.*",
] as const;

export async function listTimelineEvents(): Promise<TimelineEvent.TimelineEvent[]> {
    const { data, errors } = await client.models.TimelineEvent.list({
        selectionSet,
    });
    const events: TimelineEvent.TimelineEvent[] = data.map((event) => {
        const validatedEvent: TimelineEvent.TimelineEvent = {
            ...event,
            assignment: { ...event.assignment, isPlaceholder: event.assignment.isPlaceholder ?? false },
            // influencerAssignmentId: event.influencerAssignmentTimelineEventsId ?? "",
        };
        return validatedEvent;
    });
    return events;
}
export async function createTimelineEvent(props: TimelineEvent.TimelineEvent) {
    // console.log(props);
    const { timelineEventType, date, notes } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;
    const { id: influencerAssignmentTimelineEventsId } = props.assignment;
    const { inviteEvent = undefined } = props as TimelineEvent.TimelineEventInvites;

    if (!(influencerAssignmentTimelineEventsId && date && campaignCampaignTimelineEventsId)) {
        console.log({ influencerAssignmentTimelineEventsId, date, campaignCampaignTimelineEventsId, props });
        throw new Error("Missing Data");
    }
    const { data: inviteEventData, errors: inviteEventErrors } = await createInviteEvent(inviteEvent);

    const { data, errors } = await client.models.TimelineEvent.create(
        {
            timelineEventType,
            date,
            campaignCampaignTimelineEventsId,
            inviteEvent: inviteEventData,
            influencerAssignmentTimelineEventsId,
            notes,
        },
        {}
    );
    // console.log(data);

    return data.id;
}
export async function updateTimelineEvent(props: TimelineEvent.TimelineEvent) {
    const { id, timelineEventType, date, notes } = props;
    const { id: campaignCampaignTimelineEventsId } = props.campaign;
    const { id: influencerAssignmentTimelineEventsId } = props.assignment;
    const { inviteEvent = undefined } = props as TimelineEvent.TimelineEventInvites;
    if (!id) {
        throw new Error("Missing Data");
    }
    console.log(inviteEvent);
    if (inviteEvent) {
        await updateInviteEvent(inviteEvent);
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
export async function deleteTimelineEvent(event: TimelineEvent.TimelineEvent) {
    if (!event.id) throw new Error("Missing Data");

    const { errors } = await client.models.TimelineEvent.delete({ id: event.id });
    console.log(errors);
}

async function createInviteEvent(props: TimelineEvent.InviteEvent | undefined) {
    if (props === undefined) return { data: undefined, errors: undefined };
    const { invites } = props;
    if (!invites) {
        throw new Error("Missing Data");
    }
    const { data, errors } = await client.models.InvitesEvent.create({
        invites,
    });
    return { data, errors };
}
async function updateInviteEvent(props: TimelineEvent.InviteEvent) {
    if (props === undefined) return { data: undefined, errors: undefined };
    const { invites, id } = props;
    if (!(invites && id)) {
        throw new Error("Missing Data");
    }
    const { data, errors } = await client.models.InvitesEvent.update({
        invites,
        id,
    });
    return { data, errors };
}
