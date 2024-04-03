import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import database, { timelineEvents } from "@/app/ServerFunctions/database/dbOperations/.database";
import { randomId } from "@mui/x-data-grid-generator";
import { useQueryClient } from "@tanstack/react-query";
import { dates } from "./TimelineEventSingleDialog";

interface createSingleEventProps {
    editing: boolean;
    event: TimelineEvent.SingleEvent;
    campaign: Campaign.Campaign;
    assignment: Assignment.AssignmentMin;
    dates: dates;
    queryClient: ReturnType<typeof useQueryClient>;
}
export async function submitSingleEvent(props: createSingleEventProps) {
    const { event, campaign, assignment, dates, editing, queryClient } = props;
    if (editing) {
        updateEvent(props);
    } else {
        createEvent(props);
    }
}

async function updateEvent(props: createSingleEventProps) {
    const {
        event,
        event: { relatedEvents },
        campaign,
        assignment,
        dates,
        editing,
        queryClient,
    } = props;
    if (!dates.dates[0]) throw new Error("No date provided for event update");
    event.date = dates.dates[0].toISOString();
    console.log(event);
    timelineEvents.update(event).then((res) => console.log(res));
    const newCampaign = {
        ...campaign,
        campaignTimelineEvents: [
            ...campaign.campaignTimelineEvents.map((x) => (x.id === event.id ? event : x)),
        ],
    };
    await handleRelatedEvents(event, relatedEvents, assignment);
    queryClient.setQueryData(["campaign", campaign.id], newCampaign);
    queryClient.setQueryData(["event", event.id], event);
    queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
        if (!oldData) return [];
        return oldData.map((x) => (x.id === event.id ? event : x));
    });
    queryClient.setQueryData(
        ["assignmentEvents", event.assignments[0].id],
        (oldData: TimelineEvent.SingleEvent[]) => {
            if (!oldData) return [];
            return oldData.map((x) => (x.id === event.id ? event : x));
        },
    );
}
async function createEvent(props: createSingleEventProps) {
    const {
        event,
        event: { relatedEvents },
        campaign,
        dates,
        queryClient,
    } = props;
    const events = queryClient.getQueryData<TimelineEvent.Event[]>(["events", campaign.id]) ?? [];
    if (!dates.dates.length) throw new Error("No dates provided for event creation");
    const assignment = event.assignments[0];
    const newEvents: TimelineEvent.SingleEvent[] = dates.dates
        .map((date): TimelineEvent.SingleEvent | undefined => {
            if (date === null) return;
            return {
                ...event,
                assignments: event.assignments,
                campaign: { id: campaign.id },
                date: date.toISOString(),
            } satisfies TimelineEvent.SingleEvent;
        })
        .filter((x): x is TimelineEvent.SingleEvent => x !== undefined);

    const originalEvents = [...events];
    const createResponse = Promise.all(
        newEvents.map(async (x) => {
            const res = await timelineEvents.create(x);

            return { ...x, id: res };
        }),
    ).then((res) => {
        appendEventsToTimeline(res, campaign, originalEvents, queryClient);
        invalidateData(res, queryClient);
    });
    await handleRelatedEvents(newEvents[0], relatedEvents, assignment);

    const tempEvents = newEvents.map((x) => ({ ...x, tempId: randomId() }));
    appendEventsToTimeline(tempEvents, campaign, campaign.campaignTimelineEvents, queryClient);
    // invalidateData(tempEvents, queryClient);
}

function appendEventsToTimeline(
    events: TimelineEvent.SingleEvent[],
    campaign: Campaign.Campaign,
    oldTimeline: TimelineEvent.Event[],
    queryClient: ReturnType<typeof useQueryClient>,
) {
    events.map((x) => queryClient.setQueryData(["event", x.id], x));
    const newTimeline = [...oldTimeline, ...events];
    const newCampaign = {
        ...campaign,
        campaignTimelineEvents: newTimeline,
    };
    //update query data
    //update campaign
    queryClient.setQueryData(["campaign", campaign.id], newCampaign);
    queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });

    //update events
    queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
        if (!oldData) return [];
        return [...oldTimeline, ...events];
    });
    queryClient.refetchQueries({ queryKey: ["events", campaign.id] });

    //update assignment events
    queryClient.setQueryData(
        ["assignmentEvents", events[0].assignments[0].id],
        (oldData: TimelineEvent.SingleEvent[]) => {
            if (!oldData) return [];
            return newTimeline;
        },
    );
    queryClient.refetchQueries({ queryKey: ["assignmentEvents", events[0].assignments[0].id] });

    // queryClient.refetchQueries({ queryKey: ["events", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["groups", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["assignmentEvents"], exact: false });
}

function invalidateData(
    events: TimelineEvent.SingleEvent[],
    queryClient: ReturnType<typeof useQueryClient>,
) {
    events.map((x) => {
        queryClient.invalidateQueries({ queryKey: ["event", x.id] });
        queryClient.invalidateQueries({ queryKey: ["assignmentEvents", x.assignments[0].id] });
    });
    queryClient.invalidateQueries({ queryKey: ["events", events[0].campaign.id] });
    queryClient.invalidateQueries({ queryKey: ["groups", events[0].campaign.id] });
    queryClient.refetchQueries({ queryKey: ["groups", events[0].campaign.id] });
    queryClient.refetchQueries({ queryKey: ["campaign", events[0].campaign.id] });
}

async function handleRelatedEvents(
    event: TimelineEvent.SingleEvent,
    relatedEvents: TimelineEvent.SingleEvent["relatedEvents"] | undefined,
    assignment: Assignment.AssignmentMin,
) {
    if (relatedEvents) {
        const { childEvents, parentEvent } = relatedEvents;
        //if updated event has children, set their parent reference to the new event
        if (childEvents && childEvents.length) {
            if (!childEvents.every((x) => x.id)) throw new Error("Child event has no id");
            await Promise.all(
                childEvents.map(async (x) => {
                    await database.timelineEvent.connectEvents(event, x);
                }),
            );
        }
        /** if new event has a parent, set the parent reference to the new event
         *  and connect the parent event to the assigned position
         */

        if (parentEvent && parentEvent.id) {
            await Promise.all([
                database.timelineEvent.connectEvents(parentEvent, event),
                database.timelineEvent.connectToAssignment(parentEvent.id, assignment.id),
            ]);
        }
    }
}
