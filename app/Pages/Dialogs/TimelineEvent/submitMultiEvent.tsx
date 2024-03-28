import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { timelineEvents } from "@/app/ServerFunctions/database/.dbInterface";
import { randomId } from "@mui/x-data-grid-generator";
import { Query, QueryClient, useQueryClient } from "@tanstack/react-query";
import { Dayjs } from "@/app/configuredDayJs";

interface createMultiEventProps {
    editing: boolean;
    event: TimelineEvent.MultiEvent;
    campaign: Campaign.Campaign;
    assignments: Assignment.AssignmentMin[];
    queryClient: ReturnType<typeof useQueryClient>;
}
export async function submitMultiEvent(props: createMultiEventProps) {
    const { event, campaign, assignments, editing, queryClient } = props;
    if (editing) {
        updateEvent(props);
    } else {
        createEvent(props);
    }
}

async function updateEvent(props: createMultiEventProps) {
    const { event, campaign, assignments, editing, queryClient } = props;
    timelineEvents.update(event).then((res) => console.log("updatedEvent", res));
    queryClient.setQueryData(["event", event.id], event);
    queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
        if (!oldData) return [];
        return oldData.map((x) => (x.id === event.id ? event : x));
    });
    assignments.map((assignment) => {
        queryClient.setQueryData(["assignmentEvents", assignment.id], (oldData: TimelineEvent.SingleEvent[]) => {
            if (!oldData) return [];
            return oldData.map((x) => (x.id === event.id ? event : x));
        });
    });
}
async function createEvent(props: createMultiEventProps) {
    const { event, campaign, assignments, queryClient } = props;
    const newEvent: TimelineEvent.MultiEvent = {
        ...event,
        campaign: { id: campaign.id },
        assignments: assignments,
    } satisfies TimelineEvent.MultiEvent;

    const tempId = randomId();

    timelineEvents.create(newEvent).then((res) => {
        queryClient.setQueryData(["event", res], { ...newEvent, id: res });
        queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
            if (!oldData) return [];
            //replace tempEvent
            return oldData.map((x) => (x.tempId === tempId ? { ...newEvent, id: res } : x));
        });
    });
    const tempEvent = { ...newEvent, tempId: tempId };
    queryClient.setQueryData(["event", tempId], tempEvent);
    queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
        if (!oldData) return [];
        return [...oldData, tempEvent];
    });
    invalidateData(tempEvent, queryClient);
}

function invalidateData(event: TimelineEvent.MultiEvent, queryClient: ReturnType<typeof useQueryClient>) {
    // events.map((x) => {
    //     queryClient.invalidateQueries({ queryKey: ["event", x.id] });
    //     queryClient.invalidateQueries({ queryKey: ["assignmentEvents", x.assignment.id] });
    // });
    // queryClient.invalidateQueries({ queryKey: ["events", events[0].campaign.id] });
    // queryClient.invalidateQueries({ queryKey: ["groups", events[0].campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["groups", events[0].campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["assignmentEvents", events[0].campaign.id] });
    queryClient.invalidateQueries({ queryKey: ["event", event.id] });
    event.assignments.map((assignment) => {
        queryClient.invalidateQueries({ queryKey: ["assignmentEvents", assignment.id] });
        queryClient.refetchQueries({ queryKey: ["assignmentEvents", assignment.id] });
    });
    queryClient.invalidateQueries({ queryKey: ["events", event.campaign.id] });
    queryClient.invalidateQueries({ queryKey: ["groups", event.campaign.id] });
    queryClient.refetchQueries({ queryKey: ["groups", event.campaign.id] });
}
