import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { randomId } from "@mui/x-data-grid-generator";
import { useQueryClient } from "@tanstack/react-query";
import { dates } from "../TimelineEventDialog";
import dataClient from "@/app/ServerFunctions/database";
import { Prettify } from "@/app/Definitions/types";
import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";

interface createEventProps {
    editing: boolean;
    event: TimelineEvent.Event;
    updatedData: Partial<TimelineEvent.Event>;
    dates: dates;
}
export async function submitEvent(props: createEventProps) {
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

async function updateEvent(props: createEventProps) {
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
async function createEvent(props: createEventProps) {
    const {
        event,
        event: { relatedEvents },
        dates,
    } = props;
    const assignment = event.assignments[0];
    const newEvent = applyDefaultValues({ event, assignment });
    if (!dates.dates.length) throw new Error("No dates provided for event creation");
    const newEvents = dates.dates
        .map((date) => {
            if (date === null) return;
            const event: TimelineEvent.Event = { ...newEvent, date: date.toISOString() };
            return event;
        })
        .filter((x): x is TimelineEvent.Event => x !== undefined);
    const createdEvents = await Promise.all(
        newEvents.map((x) => dataClient.timelineEvent.create(x) as Promise<TimelineEvent.EventWithId>)
    );
    createdEvents.map((event) => {
        event.emailTriggers = applyEmailTriggerDefaults({ event });
        createEmailTriggers({ event });
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
interface applyDefaultValuesProps {
    event: TimelineEvent.Event;
    assignment?: Assignment.AssignmentMin;
}
function applyDefaultValues(props: applyDefaultValuesProps) {
    const { event, assignment } = props;
    event.assignments = assignment ? [assignment] : [];
    event.eventAssignmentAmount = event.eventAssignmentAmount ?? 1;
    event.eventTaskAmount = event.eventTaskAmount ?? 1;
    event.eventTitle = event.eventTitle ?? "Neues Event";
    event.relatedEvents = {
        parentEvent: event.relatedEvents?.parentEvent ?? null,
        childEvents: event.relatedEvents?.childEvents ?? [],
    };
    event.relatedEvents.childEvents = event.relatedEvents.childEvents.map((x) => ({
        ...x,
        assignments: assignment ? [assignment] : [],
    }));
    return event;
}
function appendEventsToTimeline(
    events: TimelineEvent.Event[],
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
    queryClient.setQueryData(["events", campaign.id], (oldData: TimelineEvent.Event[]) => {
        if (!oldData) return [];
        return [...oldTimeline, ...events];
    });
    queryClient.refetchQueries({ queryKey: ["events", campaign.id] });

    //update assignment events
    queryClient.setQueryData(["assignmentEvents", events[0].assignments[0].id], (oldData: TimelineEvent.Event[]) => {
        if (!oldData) return [];
        return newTimeline;
    });
    queryClient.refetchQueries({ queryKey: ["assignmentEvents", events[0].assignments[0].id] });

    // queryClient.refetchQueries({ queryKey: ["events", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["groups", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });
    // queryClient.refetchQueries({ queryKey: ["assignmentEvents"], exact: false });
}

function invalidateData(events: TimelineEvent.Event[], queryClient: ReturnType<typeof useQueryClient>) {
    events.map((x) => {
        queryClient.invalidateQueries({ queryKey: ["event", x.id] });
        queryClient.invalidateQueries({ queryKey: ["assignmentEvents", x.assignments[0].id] });
    });
    queryClient.invalidateQueries({ queryKey: ["events", events[0].campaign.id] });
    queryClient.invalidateQueries({ queryKey: ["groups", events[0].campaign.id] });
    queryClient.refetchQueries({ queryKey: ["groups", events[0].campaign.id] });
    queryClient.refetchQueries({ queryKey: ["campaign", events[0].campaign.id] });
}

interface handleRelatedEventsProps {
    event: TimelineEvent.Event;
    relatedEvents?: TimelineEvent.Event["relatedEvents"];
    assignment: Assignment.AssignmentMin;
}
async function handleRelatedEvents(props: handleRelatedEventsProps) {
    const { event, relatedEvents, assignment } = props;
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
interface createEmailTriggersProps {
    event: TimelineEvent.EventWithId;
}
async function createEmailTriggers({ event }: createEmailTriggersProps) {
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

interface applyEmailTriggerDefaultsProps {
    event: TimelineEvent.EventWithId;
}
function applyEmailTriggerDefaults({ event }: applyEmailTriggerDefaultsProps) {
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
