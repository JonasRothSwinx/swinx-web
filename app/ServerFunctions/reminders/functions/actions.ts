import client from "../../database/.dbclient";
import { Dayjs } from "@/app/configuredDayJs";

interface timespan {
    start: Dayjs;
    end: Dayjs;
}
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
] as const;
export async function getTimelineEvents(timespan: timespan) {
    const { data: events, errors } = await client.models.TimelineEvent.list({ selectionSet });
    const inviteEvents = events.filter((event) => event.timelineEventType === "invite");
}
