import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { randomId } from "@mui/x-data-grid-generator";
import { useQueryClient } from "@tanstack/react-query";
import { dates } from "./TimelineEventSingleDialog";
import dataClient from "@/app/ServerFunctions/database";
import { Prettify } from "@/app/Definitions/types";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";

interface createSingleEventProps {
    editing: boolean;
    event: TimelineEvent.SingleEvent;
    updatedData: Partial<TimelineEvent.SingleEvent>;
    // campaign: Campaign.Campaign;
    // assignment: Assignment.AssignmentMin;
    dates: dates;
    // queryClient: ReturnType<typeof useQueryClient>;
}
export async function submitSingleEvent(props: createSingleEventProps) {
    const { editing } = props;
    try {
        if (editing) {
            updateEvent(props);
        } else {
            createEvent(props);
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateEvent(props: createSingleEventProps) {
    const {
        event,
        event: { relatedEvents },
        dates,
        updatedData,
    } = props;
    const assignment = event.assignments[0];
    if (!dates.dates[0]) throw new Error("No date provided for event update");
    event.date = dates.dates[0].toISOString();
    dataClient.timelineEvent.update(updatedData, event);
    // console.log(event);
    // timelineEvents.update(event).then((res) => console.log(res));
    // const newCampaign = {
    //     ...campaign,
    //     campaignTimelineEvents: [
    //         ...campaign.campaignTimelineEvents.map((x) => (x.id === event.id ? event : x)),
    //     ],
    // };
    // await handleRelatedEvents(event, relatedEvents, assignment);
    // queryClient.setQueryData(["campaign", campaign.id], newCampaign);
    // queryClient.setQueryData(["event", event.id], event);
    // queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.SingleEvent[]) => {
    //     if (!oldData) return [];
    //     return oldData.map((x) => (x.id === event.id ? event : x));
    // });
    // queryClient.setQueryData(
    //     ["assignmentEvents", event.assignments[0].id],
    //     (oldData: TimelineEvent.SingleEvent[]) => {
    //         if (!oldData) return [];
    //         return oldData.map((x) => (x.id === event.id ? event : x));
    //     },
    // );
}
async function createEvent(props: createSingleEventProps) {
    const {
        event,
        event: { relatedEvents },
        dates,
    } = props;
    const assignment = event.assignments[0];
    const newEvent = applyDefaultValues(event, assignment);
    if (!dates.dates.length) throw new Error("No dates provided for event creation");
    const newEvents = dates.dates
        .map((date) => {
            if (date === null) return;
            const event: TimelineEvent.SingleEvent = { ...newEvent, date: date.toISOString() };
            return event;
        })
        .filter((x): x is TimelineEvent.SingleEvent => x !== undefined);
    const createdEvents = await Promise.all(
        newEvents.map((x) => dataClient.timelineEvent.create(x) as Promise<TimelineEvent.SingleEventWithId>)
    );
    createdEvents.map((x) => {
        x.emailTriggers = applyEmailTriggerDefaults(x);
        createEmailTriggers(x);
    });

    // const events = queryClient.getQueryData<TimelineEvent.Event[]>(["events", campaign.id]) ?? [];
    // if (!dates.dates.length) throw new Error("No dates provided for event creation");
    // const assignment = event.assignments[0];
    // const newEvents: TimelineEvent.SingleEvent[] = dates.dates
    //     .map((date): TimelineEvent.SingleEvent | undefined => {
    //         if (date === null) return;
    //         return {
    //             ...event,
    //             assignments: event.assignments,
    //             campaign: { id: campaign.id },
    //             date: date.toISOString(),
    //         } satisfies TimelineEvent.SingleEvent;
    //     })
    //     .filter((x): x is TimelineEvent.SingleEvent => x !== undefined);

    // const originalEvents = [...events];
    // const createResponse = Promise.all(
    //     newEvents.map(async (x) => {
    //         const res = await timelineEvents.create(x);

    //         return { ...x, id: res };
    //     }),
    // ).then((res) => {
    //     appendEventsToTimeline(res, campaign, originalEvents, queryClient);
    //     invalidateData(res, queryClient);
    // });
    // await handleRelatedEvents(newEvents[0], relatedEvents, assignment);

    // const tempEvents = newEvents.map((x) => ({ ...x, tempId: randomId() }));
    // appendEventsToTimeline(tempEvents, campaign, campaign.campaignTimelineEvents, queryClient);
    // invalidateData(tempEvents, queryClient);
}

function applyDefaultValues(event: TimelineEvent.SingleEvent, assignment: Assignment.AssignmentMin) {
    event.assignments = [assignment];
    event.eventAssignmentAmount = event.eventAssignmentAmount ?? 1;
    event.eventTaskAmount = event.eventTaskAmount ?? 1;
    event.eventTitle = event.eventTitle ?? "Neues Event";
    event.relatedEvents = {
        parentEvent: event.relatedEvents?.parentEvent ?? null,
        childEvents: event.relatedEvents?.childEvents ?? [],
    };
    event.relatedEvents.childEvents = event.relatedEvents.childEvents.map((x) => ({
        ...x,
        assignments: [assignment],
    }));
    return event;
}
function appendEventsToTimeline(
    events: TimelineEvent.SingleEvent[],
    campaign: Campaign.Campaign,
    oldTimeline: TimelineEvent.Event[],
    queryClient: ReturnType<typeof useQueryClient>
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
        }
    );
    queryClient.refetchQueries({ queryKey: ["assignmentEvents", events[0].assignments[0].id] });

    // queryClient.refetchQueries({ queryKey: ["events", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["groups", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["assignmentEvents"], exact: false });
}

function invalidateData(events: TimelineEvent.SingleEvent[], queryClient: ReturnType<typeof useQueryClient>) {
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
    assignment: Assignment.AssignmentMin
) {
    if (relatedEvents) {
        const { childEvents, parentEvent } = relatedEvents;
        //if updated event has children, set their parent reference to the new event
        if (childEvents && childEvents.length) {
            if (!childEvents.every((x) => x.id)) throw new Error("Child event has no id");
            await Promise.all(
                childEvents.map(async (x) => {
                    // dataClient.timelineEvent.
                })
            );
        }
        /** if new event has a parent, set the parent reference to the new event
         *  and connect the parent event to the assigned position
         */

        if (parentEvent && parentEvent.id) {
            await Promise.all([
                // database.timelineEvent.connectEvents(parentEvent, event),
                // database.timelineEvent.connectToAssignment(parentEvent.id, assignment.id),
            ]);
        }
    }
}

async function createEmailTriggers(event: Prettify<TimelineEvent.SingleEvent & { id: string }>) {
    const triggers = event.emailTriggers;
    console.log("Creating email triggers", triggers);
    try {
        if (triggers && triggers.length) {
            await Promise.all(
                triggers.map(async (x) => {
                    const trigger = {
                        ...x,
                        event: event,
                    };
                    console.log("Telling dataClient to create email trigger", trigger);
                    const createdTrigger = await dataClient.emailTrigger.create(trigger);
                    console.log("Created email trigger", createdTrigger);
                })
            );
        }
    } catch (error) {
        console.error("Error creating email triggers", error);
    }
}

function applyEmailTriggerDefaults(event: TimelineEvent.SingleEventWithId) {
    const { emailTriggers, type } = event;
    if (emailTriggers && emailTriggers.length) return emailTriggers;
    const defaults = EmailTriggers.EventEmailTriggerDefaults[type];
    const triggers: EmailTriggers.EmailTriggerEventRef[] = [];
    Object.entries(defaults).forEach(([key, value]) => {
        if (value === null) return;
        const offset = value.offset;

        const newTrigger: EmailTriggers.EmailTriggerEventRef = {
            date: dayjs(event.date).add(offset).toISOString(),
            type: key as EmailTriggers.emailTriggerType,
            event: { id: event.id },
            active: true,
            sent: false,
        };
        triggers.push(newTrigger);
    });
    return triggers;
}
