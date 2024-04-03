import client from "../../database/dbOperations/.dbclient";
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
] as const;
export async function getTimelineEvents(timespan: timespan) {
    return "not implemented";
    // const { data: events, errors } = await client.models.TimelineEvent.list({ selectionSet });
    // const inviteEvents = events.filter((event) => event.timelineEventType === "invite");
}
