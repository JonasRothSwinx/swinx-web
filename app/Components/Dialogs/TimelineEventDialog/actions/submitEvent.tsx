import { dataClient } from "@dataClient";
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
    const updatedEvent = await dataClient.event.update({
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
    const createdEvent = await dataClient.event.create(newEvent);
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
    Object.entries(defaults).forEach(([key, triggerOffsets]) => {
        if (triggerOffsets.length === 0) return;
        const triggerType = key as EmailTriggers.emailTriggerType;

        for (const triggerOffset of triggerOffsets) {
            const offset = triggerOffset.offset;
            let date: Dayjs;
            switch (triggerType) {
                case "actionReminder":
                    date = dayjs(event.date).add(offset);
                    break;
                case "deadlineReminder":
                    date = dayjs(event.info?.draftDeadline).add(offset);
                    break;
                default:
                    date = dayjs(event.date).add(offset);
            }

            const newTrigger: EmailTriggers.EmailTriggerEventRef = {
                date: date.toISOString(),
                type: triggerType,
                event: { id: event.id },
                active: true,
                sent: false,
            };
            triggers.push(newTrigger);
        }
    });
    return triggers;
}
