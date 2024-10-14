import { Schema } from "@/amplify/data/resource.js";
import { Assignments, EmailTriggers, Events } from "@/app/ServerFunctions/types";
import { generateClient } from "aws-amplify/data";
import {
    EmailTriggerData,
    ListEmailTriggersQuery,
    ListEmailTriggersQueryItem,
    RawEmailTrigger,
    listEmailTriggers,
} from "./types";
import { updateEmailTrigger } from "../../graphql/mutations";
// import { listEmailTriggers } from "../../graphql/queries";

const dataClient = generateClient<Schema>();

interface GetEmailTriggersForDateRangeParams {
    start: string;
    end: string;
}

type ListEmailTrigger = NonNullable<ListEmailTriggersQuery["listEmailTriggers"]>["items"];
// type GetEmailTrigger = NonNullable<GetEmailTriggerQuery["getEmailTrigger"]>;
// type GetEvent = NonNullable<GetTimelineEventQuery["getTimelineEvent"]>;
// type EventAssignment = NonNullable<ListEmailTriggerQuery["listEmailTriggers"]>["items"];

export async function getEmailTriggersForDateRange({
    start,
    end,
}: GetEmailTriggersForDateRangeParams): Promise<Array<EmailTriggerData>> {
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
    if (emailTriggers.length === 0) {
        console.log("No triggers found for today, stopping reminder routine");
        return [];
    } else {
        console.log(`Found ${emailTriggers.length} triggers for today, parsing data`);
    }

    const items: EmailTriggerData[] = parseEmailTriggers(emailTriggers);
    console.log(JSON.stringify(items[0], null, 2));
    // console.log({ items });

    // console.log({ data, errors });
    // console.log(data?.listEmailTriggers.items);
    // const triggers = validateTriggers(data);

    return items;
}
const introspectionQuery = /* GraphQL */ ` query IntrospectionQuery {
    __schema {
        queryType{
            name
            fields {
                name
                fields {
                    name
                    type {
                        name
                        kind
                        ofType {
                            name
                            kind
                            ofType {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        }
        # types{
        #     kind
        #     name
        #     fields {
        #         name
        #     }
        # }
    }
    # __type(name: "EmailTrigger") {
    #     # kind
    #     name
    #     fields {
    #         name
    #         type {
    #             # name
    #             # kind
    #             fields{
    #                 name
    #                 type {
    #                     # name
    #                     # kind
    #                     fields{
    #                         name
    #                     }
    #                 }
    #             }
    #         }
    #     }
    # }
}
` as string;
export async function schemaIntrospection() {
    console.log("Introspecting schema");
    try {
        const response = await dataClient.graphql({
            query: introspectionQuery,
        });
        console.log("Introspection response:", JSON.stringify(response, null, 2));
    } catch (error) {
        console.error(error);
    }
}

function parseEmailTrigger(data: ListEmailTriggersQueryItem): EmailTriggerData | null {
    try {
        const { event: rawEvent } = data;
        const rawTrigger: RawEmailTrigger = data;
        const rawCampaign = rawEvent.campaign;
        const rawAssignment = rawEvent.assignments.items[0].assignment;
        const rawInfluencer = rawAssignment.influencer;
        const rawParentEvent = rawEvent.parentEvent;
        const rawProjectManagers = rawCampaign.projectManagers.items.map((x) => x.projectManager);
        const rawCustomer = rawCampaign.customers.items[0];
        if (!rawAssignment) {
            console.log("No assignment found", { data });
            return null;
        }
        if (!rawInfluencer) {
            console.log("No influencer found", { data });
            return null;
        }
        if (!rawParentEvent) {
            console.log("No parent event found", { data });
            return null;
        }
        if (!rawEvent) {
            console.log("No event found", { data });
            return null;
        }
        if (!rawCampaign) {
            console.log("No campaign found", { data });
            return null;
        }
        if (!rawCustomer) {
            console.log("No customer found", { data });
            return null;
        }
        if (!rawProjectManagers) {
            console.log("No project managers found", { data });
            return null;
        }

        const parsedCustomer: EmailTriggerData["customer"] = {
            id: rawCustomer.id,
            company: rawCustomer.company,
            firstName: "<redacted>",
            lastName: "<redacted>",
            email: "<redacted>",
            companyPosition: "<redacted>",
            notes: "",
        };

        const parsedProjectManagers: EmailTriggerData["projectManagers"] = rawProjectManagers.map(
            (x) => ({
                id: x.id,
                firstName: x.firstName,
                lastName: x.lastName,
                email: x.email,
                phoneNumber: x.phoneNumber,
                jobTitle: x.jobTitle,
                cognitoId: "",
            }),
        );

        const parsedInfluencer: EmailTriggerData["influencer"] = {
            id: rawInfluencer.id,
            firstName: rawInfluencer.firstName,
            lastName: rawInfluencer.lastName,
            email: rawInfluencer.email,
            emailLevel: rawInfluencer.emailType as EmailTriggers.emailLevel,
        };

        const parsedParentEvent: EmailTriggerData["parentEvent"] = {
            id: rawParentEvent.id,
            type: rawParentEvent.timelineEventType as Events.EventType,
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
            status: rawParentEvent.status ?? "WAITING_FOR_DRAFT",
        };

        const parsedEvent: EmailTriggerData["event"] = {
            id: rawEvent.id,
            type: rawEvent.timelineEventType as Events.EventType,
            info: rawEvent.info,
            date: rawEvent.date,
            campaign: { id: rawEvent.campaign.id },
            eventAssignmentAmount: 0,
            eventTaskAmount: rawEvent.eventTaskAmount ?? 0,
            eventTitle: rawEvent.eventTitle ?? "<Error: No Title>",
            assignments: rawEvent.assignments.items.map((x) => {
                const out: Assignments.Min = {
                    id: x.assignment.id,
                    isPlaceholder: x.assignment.isPlaceholder,
                    influencer: null,
                    campaign: { id: rawEvent.campaign.id },
                    placeholderName: "",
                    timelineEvents: [],
                };
                return out;
            }),
            childEvents: [],
            parentEvent: parsedParentEvent,
            emailTriggers: [],
            targetAudience: {
                cities: [],
                country: [],
                industry: [],
            },
            isCompleted: false,

            status: rawEvent.status ?? "WAITING_FOR_DRAFT",
        };

        const parsedTrigger: EmailTriggerData["trigger"] = {
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
            projectManagers: parsedProjectManagers,
            customer: parsedCustomer,
            influencer: parsedInfluencer,
            event: parsedEvent,
            parentEvent: parsedParentEvent,
        };
        return out;
    } catch (error) {
        console.log("Error parsing email trigger", { error, rawData: data });
        return null;
    }
}
function parseEmailTriggers(data: ListEmailTriggersQueryItem[]): EmailTriggerData[] {
    return data.map(parseEmailTrigger).filter((x): x is EmailTriggerData => x !== null);
}

export async function markTriggerAsSent(triggerId: string): Promise<void> {
    console.log("Marking trigger as sent", triggerId);
    const response = await dataClient.graphql({
        query: updateEmailTrigger,
        variables: {
            input: {
                id: triggerId,
                sent: true,
            },
        },
    });
    console.log("Marked trigger as sent", JSON.stringify(response, null, 2));
}
