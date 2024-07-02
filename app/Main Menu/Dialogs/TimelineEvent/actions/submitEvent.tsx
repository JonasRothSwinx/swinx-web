import { randomId } from "@mui/x-data-grid-generator";
import { useQueryClient } from "@tanstack/react-query";
import { dates } from "../TimelineEventDialog";
import { dataClient } from "@/app/ServerFunctions/database";
import { Prettify } from "@/app/Definitions/types";
import { dayjs, Dayjs } from "@/app/utils";
import {
    EmailTrigger,
    Event,
    Events,
    Assignment,
    Campaign,
    Assignments,
    EmailTriggers,
} from "@/app/ServerFunctions/types";

type updateEventProps = SubmitEventProps & {
    editing: true;
    updatedData?: Partial<Event>;
};
type createEventProps = SubmitEventProps & {
    editing: false;
};
type SubmitEventProps = {
    event: Event;
    // dates: dates;
    editing: boolean;
};
export async function submitEvent(props: updateEventProps): Promise<Event>;
export async function submitEvent(props: createEventProps): Promise<Events.EventWithId>;
export async function submitEvent(props: createEventProps | updateEventProps) {
    const { editing } = props;
    try {
        if (editing) {
            return updateEvent(props);
        } else {
            return createEvent(props);
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateEvent(props: updateEventProps) {
    const { event, updatedData } = props;
    if (!event.id) throw new Error("No event id provided for event update");
    const assignment = event.assignments[0];
    // if (!dates.dates[0]) throw new Error("No date provided for event update");
    if (!updatedData) return event;
    updatedData.info = { ...event.info, ...updatedData.info };
    const updatedEvent = await dataClient.timelineEvent.update({
        id: event.id,
        updatedData: updatedData,
    });
    return updatedEvent;
}

async function createEvent(props: createEventProps) {
    const { event } = props;
    const assignment = event.assignments[0];
    const newEvent = applyDefaultValues({ event, assignment });
    // if (!dates.dates.length) throw new Error("No dates provided for event creation");
    // const newEvents = dates.dates
    //     .map((date) => {
    //         if (date === null) return;
    //         const event: Event = { ...newEvent, date: date.toISOString() };
    //         return event;
    //     })
    //     .filter((x): x is Event => x !== undefined);
    const createdEvent = await dataClient.timelineEvent.create(newEvent);
    createdEvent.emailTriggers = applyEmailTriggerDefaults({ event: createdEvent });
    createEmailTriggers({ event: createdEvent });
    return createdEvent;
}
interface applyDefaultValuesProps {
    event: Event;
    assignment?: Assignments.Min;
}
function applyDefaultValues(props: applyDefaultValuesProps) {
    const { event, assignment } = props;
    const newEvent: Event = {
        ...event,
        assignments: assignment ? [assignment] : [],
        eventAssignmentAmount: event.eventAssignmentAmount ?? 0,
        eventTaskAmount: event.eventTaskAmount ?? 0,
        eventTitle: event.eventTitle ?? "Neues Event",
        parentEvent: event.parentEvent ?? null,
        childEvents: event.childEvents
            ? event.childEvents.map((x) => ({ ...x, assignments: assignment ? [assignment] : [] }))
            : [],
    };
    return newEvent;
}
function appendEventsToTimeline(
    events: Event[],
    campaign: Campaign,
    oldTimeline: Event[],
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
    queryClient.setQueryData(["events", campaign.id], (oldData: Event[]) => {
        if (!oldData) return [];
        return [...oldTimeline, ...events];
    });
    queryClient.refetchQueries({ queryKey: ["events", campaign.id] });

    //update assignment events
    queryClient.setQueryData(
        ["assignmentEvents", events[0].assignments[0].id],
        (oldData: Event[]) => {
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

function invalidateData(events: Event[], queryClient: ReturnType<typeof useQueryClient>) {
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
    event: Event;
    parentEvent?: Event["parentEvent"];
    childEvents?: Event["childEvents"];
    assignment: Assignments.Min;
}
async function handleRelatedEvents(props: handleRelatedEventsProps) {
    const { event, parentEvent, childEvents, assignment } = props;
    //if updated event has children, set their parent reference to the new event
    if (childEvents && childEvents.length) {
        if (!childEvents.every((x) => x.id)) throw new Error("Child event has no id");
        await Promise.all(
            childEvents.map(async (x) => {
                // dataClient.timelineEvent.
            }),
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
interface createEmailTriggersProps {
    event: Events.EventWithId;
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
                }),
            );
        }
    } catch (error) {
        console.error("Error creating email triggers", error);
    }
}

interface applyEmailTriggerDefaultsProps {
    event: Events.EventWithId;
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
