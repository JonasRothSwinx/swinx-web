import { Nullable } from "@/app/Definitions/types.js";
import {
    Customer,
    EmailTriggers,
    Event,
    Events,
    Influencer,
    Influencers,
    ProjectManager,
} from "@/app/ServerFunctions/types";

type GeneratedQuery<InputType, OutputType> = string & {
    __generatedQueryInput: InputType;
    __generatedQueryOutput: OutputType;
};
export const listEmailTriggers = /* GraphQL */ `query ListEmailTriggers(
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
export type ListEmailTriggersQuery = {
    listEmailTriggers?: {
        items: Array<ListEmailTriggersQueryItem>;
        nextToken?: string | null;
    } | null;
};
export type ListEmailTriggersQueryItem = RawEmailTrigger & {
    event: RawEvent;
};
export type RawEmailTrigger = {
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
export type EmailTriggerData = {
    trigger: EmailTriggers.EmailTriggerPure;
    event: Events.EventWithId;
    parentEvent: Event;
    customer: Customer;
    influencer: Influencers.WithContactInfo;
    projectManagers: ProjectManager[];
};
