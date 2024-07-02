"use server";
import { Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import config from "@/amplify_outputs.json";
import { cookies } from "next/headers";
import { SelectionSet } from "aws-amplify/api";
import { Nullable } from "@/app/Definitions/types";
import {
    ProjectManager,
    Customer,
    Event,
    Assignment,
    EmailTriggers,
    Events,
} from "@/app/ServerFunctions/types";

const client = generateServerClientUsingCookies<Schema>({ config, cookies, authMode: "apiKey" });

interface GetEmailTriggersForDateRangeParams {
    start: string;
    end: string;
}

const getEmailTriggersForDateRangeSelectionSet = [
    //General Info
    "id",
    "date",
    "type",
    //State
    "active",
    "sent",
    //Overrides
    "emailLevelOverride",
    "subjectLineOverride",
    "emailBodyOverride",
    //Event Info
    "event.id",
    "event.isCompleted",
    "event.assignments.assignment.isPlaceholder",
    "event.assignments.assignment.influencer.id",
    "event.assignments.assignment.influencer.firstName",
    "event.assignments.assignment.influencer.lastName",
    "event.assignments.assignment.influencer.email",
    "event.assignments.assignment.influencer.emailType",
] as const;
type EmailTrigger = SelectionSet<
    Schema["EmailTrigger"]["type"],
    typeof getEmailTriggersForDateRangeSelectionSet
>;
export async function getEmailTriggersForDateRange({
    start,
    end,
}: GetEmailTriggersForDateRangeParams) {
    const { data, errors } = await client.models.EmailTrigger.list({
        filter: { date: { between: [start, end] } },
        selectionSet: getEmailTriggersForDateRangeSelectionSet,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    const triggers = validateTriggers(data);

    return triggers;
}
function validateTrigger(data: EmailTrigger): EmailTriggers.EmailTriggerEventRef {
    const influencer = {
        ...data.event.assignments[0].assignment.influencer,
        email: data.event.assignments[0].assignment.influencer.email ?? "<Error>",
        emailType:
            data.event.assignments[0].assignment.influencer.emailType ??
            ("new" as EmailTriggers.emailLevel),
    };
    const event = {
        id: data.event.id,
        isCompleted: data.event.isCompleted ?? false,
    };
    const triggerOut: EmailTriggers.EmailTriggerEventRef = {
        id: data.id,
        date: data.date,
        type: data.type as EmailTriggers.emailTriggerType,
        active: data.active,
        sent: data.sent,
        emailLevelOverride: data.emailLevelOverride as EmailTriggers.emailLevel,
        subjectLineOverride: data.subjectLineOverride,
        emailBodyOverride: data.emailBodyOverride,
        event,
        influencer,
    };
    return triggerOut;
}
function validateTriggers(data: EmailTrigger[]) {
    return data.map(validateTrigger);
}
const getEventForEmailTriggerSelectionSet = [
    //Event info
    "id",
    "timelineEventType",
    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",
    "date",
    "notes",
    "info.*",
    "isCompleted",

    //campaign info
    "campaign.id",

    // //assignment info
    // "assignments.*",
    // "assignments.assignment.id",
    // "assignments.assignment.isPlaceholder",
    // "assignments.assignment.placeholderName",
    // "assignments.assignment.influencer.id",
    // "assignments.assignment.influencer.firstName",
    // "assignments.assignment.influencer.lastName",
    // "assignments.assignment.influencer.email",

    //child events
    "childEvents.id",
    "childEvents.timelineEventType",
    "parentEventId",

    //email triggers
    "emailTriggers.*",

    //target audience
    "targetAudience.*",
    //Campaign info
    "campaign.customers.*",
    "campaign.projectManagers.projectManager.*",
] as const;
type RawEvent = SelectionSet<
    Schema["TimelineEvent"]["type"],
    typeof getEventForEmailTriggerSelectionSet
>;
export async function getEventForEmailTrigger(eventId: string): Promise<
    Nullable<{
        event: Event;
        customer: Customer;
        projectManagers: ProjectManager[];
    }>
> {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: getEventForEmailTriggerSelectionSet,
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    if (data === null) return null;
    const parentEvent = data.parentEventId ? await getEvent(data.parentEventId) : null;
    const event = validateEvent(data, parentEvent);
    const campaign = data.campaign;
    const rawCustomer = campaign.customers[0];
    const customer: Customer = {
        id: rawCustomer.id,
        company: rawCustomer.company ?? "<Error>",
        firstName: rawCustomer.firstName ?? "<Error>",
        lastName: rawCustomer.lastName ?? "<Error>",
        email: rawCustomer.email ?? "<Error>",
        companyPosition: rawCustomer.companyPosition,
        notes: rawCustomer.notes,
    };
    const projectManagers: ProjectManager[] = campaign.projectManagers.map((x) => {
        const projectManager: ProjectManager = {
            id: x.projectManager.id,
            firstName: x.projectManager.firstName ?? "<Error>",
            lastName: x.projectManager.lastName ?? "<Error>",
            email: x.projectManager.email ?? "<Error>",
            phoneNumber: x.projectManager.phoneNumber ?? undefined,
            notes: x.projectManager.notes ?? undefined,
            cognitoId: x.projectManager.cognitoId,
        };
        return projectManager;
    });

    return { event, customer, projectManagers };
}
const getEventSelectionSet = [
    "id",
    "timelineEventType",
    "eventAssignmentAmount",
    "eventTitle",
    "eventTaskAmount",
    "date",
    "notes",
    "info.*",
    "isCompleted",
    "targetAudience.*",
] as const;
type ParentEvent = SelectionSet<Schema["TimelineEvent"]["type"], typeof getEventSelectionSet>;
export async function getEvent(eventId: string): Promise<Nullable<ParentEvent>> {
    const { data, errors } = await client.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: getEventSelectionSet,
        },
    );
    if (errors) throw new Error(JSON.stringify(errors));
    if (data === null) return null;
    return data;
}
function validateEvent(data: RawEvent, rawParentEvent: Nullable<ParentEvent>): Event {
    const assignments: Assignment[] = [];
    const targetAudience: Event["targetAudience"] = {
        cities:
            rawParentEvent?.targetAudience?.cities?.filter((x): x is string => x !== null) ?? [],
        country:
            rawParentEvent?.targetAudience?.country?.filter((x): x is string => x !== null) ?? [],
        industry:
            rawParentEvent?.targetAudience?.industry?.filter((x): x is string => x !== null) ?? [],
    };
    const parentEvent: Nullable<Event> = rawParentEvent
        ? ({
              id: rawParentEvent.id,
              type: rawParentEvent.timelineEventType as Events.eventType,
              info: rawParentEvent.info ?? { eventLink: "" },
              date: rawParentEvent.date,
              campaign: { id: data.campaign.id },
              eventAssignmentAmount: rawParentEvent.eventAssignmentAmount ?? 0,
              eventTaskAmount: rawParentEvent.eventTaskAmount ?? 0,
              eventTitle: rawParentEvent.eventTitle ?? "<Error: No Title>",
              assignments,
              childEvents: [],
              parentEvent: null,
              emailTriggers: [],
              targetAudience,
              isCompleted: false,
          } satisfies Event)
        : null;
    const event: Event = {
        id: data.id,
        type: data.timelineEventType as Events.eventType,
        eventAssignmentAmount: data.eventAssignmentAmount ?? 0,
        eventTitle: data.eventTitle ?? "<Error: No Title>",
        eventTaskAmount: data.eventTaskAmount ?? 0,
        date: data.date,
        notes: data.notes,
        info: data.info,
        isCompleted: data.isCompleted ?? false,
        campaign: { id: data.campaign.id },
        assignments,
        parentEvent,
        childEvents: data.childEvents,
        emailTriggers: [],
        targetAudience,
    };
    return event;
}
