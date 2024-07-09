"use server";
import { Schema } from "@/amplify/data/resource.js";
import { SelectionSet } from "aws-amplify/api";
import { generateClient } from "aws-amplify/data";
import { Nullable } from "@/app/Definitions/types.js";
import {
    ProjectManager,
    Customer,
    Event,
    Assignment,
    EmailTriggers,
    Events,
    Campaign,
    Influencer,
} from "@/app/ServerFunctions/types";
import * as API from "@/amplify/functions/reminderTrigger/graphql/API";
import { emailLevels } from "@/app/ServerFunctions/types/emailTriggers";
import { parse } from "path";
// import { listEmailTriggers } from "../../graphql/queries";

const dataClient = generateClient<Schema>();

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
// type EmailTrigger = SelectionSet<
//     Schema["EmailTrigger"]["type"],
//     typeof getEmailTriggersForDateRangeSelectionSet
// >;

type GeneratedQuery<InputType, OutputType> = string & {
    __generatedQueryInput: InputType;
    __generatedQueryOutput: OutputType;
};

const listEmailTriggers = /* GraphQL */ `query ListEmailTriggers(
        $startDate: String!
        $endDate: String!
        $nextToken: String
        $limit: Int
) {
    listEmailTriggers(filter: {date: {between: [$startDate, $endDate]}}, limit: $limit, nextToken: $nextToken) {
        items{
            id
            date
            type
            active
            sent
            emailBodyOverride
            emailLevelOverride
            subjectLineOverride
            event {
                id
                timelineEventType
                isCompleted
                eventTitle
                eventTaskAmount
                date
                info {
                    topic
                    charLimit
                    draftDeadline
                    instructions
                    maxDuration
                    eventLink
                    eventPostContent
                }
                campaign {
                    customers(limit:1){
                        items{
                            id
                            company
                        }
                    }
                    projectManagers{
                        items{
                            projectManager{
                                id
                                firstName
                                lastName
                                email
                                phoneNumber
                                jobTitle
                            }
                        }
                    }
                }
                assignments(limit:1){
                    items{
                        assignment{
                            id
                            isPlaceholder
                            influencer{
                                id
                                firstName
                                lastName
                                email
                                emailType
                            }
                        }
                    }
                }
                parentEvent{
                    id
                    timelineEventType
                    isCompleted
                    eventTitle
                    date
                    info {
                        topic
                        charLimit
                        draftDeadline
                        instructions
                        maxDuration
                        eventLink
                        eventPostContent
                    }
                }
                eventResources{
                    textDraft
                    videoDraft
                    imageDraft
                }
            }
        }
    }
}
` as GeneratedQuery<ListEmailTriggersQueryVariables, ListEmailTriggersQuery>;

type ListEmailTriggersQueryVariables = {
    startDate: string;
    endDate: string;
    nextToken?: string | null;
    limit?: number | null | undefined;
};
type ListEmailTriggersQuery = {
    listEmailTriggers?: {
        items: Array<ListEmailTriggersQueryItem>;
        nextToken?: string | null;
    } | null;
};
type ListEmailTriggersQueryItem = RawEmailTrigger & {
    event: RawEvent;
};
type RawEmailTrigger = {
    id: string;
    date: string;
    type: string;
    active: boolean;
    sent: boolean;
    emailBodyOverride: Nullable<string>;
    emailLevelOverride: Nullable<string>;
    subjectLineOverride: Nullable<string>;
};

type RawEvent = RawParentEvent & {
    eventTaskAmount: number;
    parentEvent: RawParentEvent;
    campaign: RawCampaign;
    assignments: {
        items: RawAssignment[];
    };
    eventResources: {
        textDraft?: string;
        videoDraft?: string;
        imageDraf: string;
    };
};
type RawParentEvent = {
    id: string;
    timelineEventType: string;
    isCompleted: boolean;
    eventTitle: string;
    date: string;
    info: {
        topic?: string;
        charLimit?: number;
        draftDeadline?: string;
        instructions?: string;
        maxDuration?: number;
        eventLink?: string;
        eventPostContent?: string;
    };
};
type RawCampaign = {
    id: string;
    customers: {
        items: RawCustomer[];
    };
    projectManagers: {
        items: RawProjectManager[];
    };
};
type RawCustomer = {
    id: string;
    company: string;
};
type RawProjectManager = {
    projectManager: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        jobTitle: string;
    };
};
type RawAssignment = {
    assignment: {
        id: string;
        isPlaceholder: boolean;
        influencer: RawInfluencer;
    };
};
type RawInfluencer = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailType: string;
};
type ListEmailTrigger = NonNullable<ListEmailTriggersQuery["listEmailTriggers"]>["items"];
// type GetEmailTrigger = NonNullable<GetEmailTriggerQuery["getEmailTrigger"]>;
// type GetEvent = NonNullable<GetTimelineEventQuery["getTimelineEvent"]>;
// type EventAssignment = NonNullable<ListEmailTriggerQuery["listEmailTriggers"]>["items"];
type EmailTriggerData = {
    trigger: EmailTriggers.EmailTriggerPure;
    Event: Event;
    ParentEvent: Event;
    Customer: Customer;
    Influencer: Influencer;
    ProjectManagers: ProjectManager[];
};
export async function getEmailTriggersForDateRange({
    start,
    end,
}: GetEmailTriggersForDateRangeParams): Promise<EmailTriggers.EmailTriggerEventRef[]> {
    // console.log(JSON.stringify(dataClient));

    let emailTriggers: ListEmailTrigger = [];
    let nextToken: string | null | undefined;
    try {
        do {
            const { data, errors } = await dataClient.graphql({
                query: listEmailTriggers,
                variables: {
                    startDate: start,
                    endDate: end,
                    limit: 1000,
                    nextToken: null,
                    // nextToken: nextToken,
                },
            });
            // console.log({ data, errors });
            if (errors) {
                throw new Error(JSON.stringify(errors));
            }
            if (!data || !data.listEmailTriggers) {
                console.log("No data found");
                return [];
            }
            const {
                listEmailTriggers: { items: newItems },
            } = data;
            const newNextToken = data.listEmailTriggers.nextToken;
            // console.log({
            //     newItems: newItems.slice(0, 1).map((x) => JSON.stringify(x, null, 1))[0],
            //     newNextToken,
            // });
            emailTriggers = emailTriggers.concat(newItems);
            nextToken = newNextToken;
        } while (nextToken !== null && nextToken !== undefined);
    } catch (error) {
        console.error(error);
    }
    const items: EmailTriggerData[] = parseEmailTriggers(emailTriggers);
    console.log(JSON.stringify(items[0], null, 2));
    // console.log({ items });

    // console.log({ data, errors });
    // console.log(data?.listEmailTriggers.items);
    // const triggers = validateTriggers(data);

    return [];
}
const introspectionQuery = /* GraphQL */ ` query IntrospectionQuery {
    # __schema {
    #     types(filter: {name: "TimelineEvent"}) {
    #         kind
    #         name
    #         fields {
    #             name
    #         }
    #     }
    # }
    __type(name: "EmailTrigger") {
        # kind
        name
        fields {
            name
            type {
                # name
                # kind
                fields{
                    name
                    type {
                        # name
                        # kind
                        fields{
                            name
                        }
                    }
                }
            }
        }
    }
}
` as string;
export async function schemaIntrospection() {
    console.log("Introspecting schema");
    try {
        const response = await dataClient.graphql({
            query: introspectionQuery,
        });
        console.log({ response: JSON.stringify(response, null, 2) });
    } catch (error) {
        console.error(error);
    }
}

function parseEmailTrigger(data: ListEmailTriggersQueryItem): EmailTriggerData {
    const { event: rawEvent } = data;
    const rawTrigger: RawEmailTrigger = data;
    const rawCampaign = rawEvent.campaign;
    const rawAssignment = rawEvent.assignments.items[0].assignment;
    const rawInfluencer = rawAssignment.influencer;
    const rawParentEvent = rawEvent.parentEvent;
    const rawProjectManagers = rawCampaign.projectManagers.items.map((x) => x.projectManager);
    const rawCustomer = rawCampaign.customers.items[0];

    const parsedCustomer: Customer = {
        id: rawCustomer.id,
        company: rawCustomer.company,
        firstName: "<redacted>",
        lastName: "<redacted>",
        email: "<redacted>",
        companyPosition: "<redacted>",
        notes: "",
    };

    const parsedProjectManagers: ProjectManager[] = rawProjectManagers.map((x) => ({
        id: x.id,
        firstName: x.firstName,
        lastName: x.lastName,
        email: x.email,
        phoneNumber: x.phoneNumber,
        jobTitle: x.jobTitle,
        cognitoId: "",
    }));

    const parsedInfluencer: Influencer = {
        id: rawInfluencer.id,
        firstName: rawInfluencer.firstName,
        lastName: rawInfluencer.lastName,
        email: rawInfluencer.email,
        emailLevel: rawInfluencer.emailType as EmailTriggers.emailLevel,
    };

    const parsedParentEvent: Event = {
        id: rawParentEvent.id,
        type: rawParentEvent.timelineEventType as Events.eventType,
        info: rawParentEvent.info,
        date: rawParentEvent.date,
        campaign: { id: rawEvent.campaign.id },
        eventAssignmentAmount: 0,
        eventTaskAmount: 0,
        eventTitle: rawParentEvent.eventTitle ?? "<Error: No Title>",
        assignments: [],
        childEvents: [],
        parentEvent: null,
        emailTriggers: [],
        targetAudience: {
            cities: [],
            country: [],
            industry: [],
        },
        isCompleted: false,
    };

    const parsedEvent: Events.EventWithId = {
        id: rawEvent.id,
        type: rawEvent.timelineEventType as Events.eventType,
        info: rawEvent.info,
        date: rawEvent.date,
        campaign: { id: rawEvent.campaign.id },
        eventAssignmentAmount: 0,
        eventTaskAmount: rawEvent.eventTaskAmount ?? 0,
        eventTitle: rawEvent.eventTitle ?? "<Error: No Title>",
        assignments: [],
        childEvents: [],
        parentEvent: parsedParentEvent,
        emailTriggers: [],
        targetAudience: {
            cities: [],
            country: [],
            industry: [],
        },
        isCompleted: false,
    };

    const parsedTrigger: EmailTriggers.EmailTriggerPure = {
        id: rawTrigger.id,
        date: rawTrigger.date,
        type: rawTrigger.type as EmailTriggers.emailTriggerType,
        active: rawTrigger.active,
        sent: rawTrigger.sent,
        emailLevelOverride: rawTrigger.emailLevelOverride as EmailTriggers.emailLevel,
        subjectLineOverride: rawTrigger.subjectLineOverride,
        emailBodyOverride: rawTrigger.emailBodyOverride,
    };

    const out: EmailTriggerData = {
        trigger: parsedTrigger,
        ProjectManagers: parsedProjectManagers,
        Customer: parsedCustomer,
        Influencer: parsedInfluencer,
        Event: parsedEvent,
        ParentEvent: parsedParentEvent,
    };
    return out;
}
function parseEmailTriggers(data: ListEmailTriggersQueryItem[]): EmailTriggerData[] {
    return data.map(parseEmailTrigger);
}

// function validateTrigger(data: GetEmailTrigger): EmailTriggers.EmailTriggerEventRef {
//     const influencer = {
//         ...data.event.assignments[0].assignment.influencer,
//         email: data.event.assignments[0].assignment.influencer.email ?? "<Error>",
//         emailType: data.event.assignments[0].assignment.influencer.emailType ?? ("new" as EmailTriggers.emailLevel),
//     };
//     const event = {
//         id: data.event.id,
//         isCompleted: data.event.isCompleted ?? false,
//     };
//     const triggerOut: EmailTriggers.EmailTriggerEventRef = {
//         id: data.id,
//         date: data.date,
//         type: data.type as EmailTriggers.emailTriggerType,
//         active: data.active,
//         sent: data.sent,
//         emailLevelOverride: data.emailLevelOverride as EmailTriggers.emailLevel,
//         subjectLineOverride: data.subjectLineOverride,
//         emailBodyOverride: data.emailBodyOverride,
//         event,
//         influencer,
//     };
//     return triggerOut;
// }

// function validateTriggers(data: GetEmailTrigger[]) {
//     return data.map(validateTrigger);
// }

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
type RawEventOld = SelectionSet<Schema["TimelineEvent"]["type"], typeof getEventForEmailTriggerSelectionSet>;
export async function getEventForEmailTrigger(eventId: string): Promise<
    Nullable<{
        event: Event;
        customer: Customer;
        projectManagers: ProjectManager[];
    }>
> {
    const { data, errors } = await dataClient.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: getEventForEmailTriggerSelectionSet,
        }
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
            jobTitle: x.projectManager.jobTitle,
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
    const { data, errors } = await dataClient.models.TimelineEvent.get(
        {
            id: eventId,
        },
        {
            selectionSet: getEventSelectionSet,
        }
    );
    if (errors) throw new Error(JSON.stringify(errors));
    if (data === null) return null;
    return data;
}
function validateEvent(data: RawEventOld, rawParentEvent: Nullable<ParentEvent>): Event {
    const assignments: Assignment[] = [];
    const targetAudience: Event["targetAudience"] = {
        cities: rawParentEvent?.targetAudience?.cities?.filter((x): x is string => x !== null) ?? [],
        country: rawParentEvent?.targetAudience?.country?.filter((x): x is string => x !== null) ?? [],
        industry: rawParentEvent?.targetAudience?.industry?.filter((x): x is string => x !== null) ?? [],
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
