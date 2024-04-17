import { Nullable } from "@/app/Definitions/types";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

export namespace RawData {
    //########################################
    //#region Campaign Types
    export type RawCampaignFull = RawCampaignWithAssignments &
        RawCampaignWithTimelineEvents &
        billingAdress;

    export type RawCampaign = {
        id: string;
        campaignManagerId: string;
        notes: Nullable<string>;
        customers: RawCustomer[];
    };
    export type RawCampaignWithTimelineEvents = RawCampaign & {
        campaignTimelineEvents: (RawTimelineEventWithRelatedEvents &
            RawTimelineEventWithAssignments)[];
    };

    export type RawCampaignWithAssignments = RawCampaign & {
        assignedInfluencers: (RawAssignmentWithCandidates & RawAssignmentWithInfluencer)[];
    };

    type billingAdress = {
        billingAdress: {
            name: string;
            street: string;
            city: string;
            zip: string;
        };
    };

    //#endregion
    //########################################

    //########################################
    //#region Assignment Types
    export type RawAssignmentFull = RawAssignmentWithInfluencer &
        RawAssignmentWithCandidates &
        RawAssignmentWithTimelineEvents;

    export type RawAssignment = {
        id: string;
        isPlaceholder: boolean;
        placeholderName: Nullable<string>;
        budget: Nullable<number>;
        campaignAssignedInfluencersId: string;
    };
    export type RawAssignmentWithInfluencer = RawAssignment & {
        influencer: Nullable<RawInfluencerFull>;
    };
    export type RawAssignmentWithCandidates = RawAssignment & {
        candidates: {
            id: string;
            response: string;
            influencer: RawInfluencerFull;
        }[];
    };
    export type RawAssignmentWithTimelineEvents = RawAssignment & {
        timelineEvents: {
            timelineEvent: RawTimelineEventWithAssignments & RawTimelineEventWithRelatedEvents;
        }[];
    };

    export type RawAssignmentWithReferences = RawAssignment & {
        influencer: { id: string };
        candidates: { id: string }[];
        timelineEvents: { id: string }[];
    };

    //#endregion
    //########################################

    //########################################
    //#region Influencer Types
    export type RawInfluencerFull = RawInfluencerPublic & RawInfluencerPrivate;

    export type RawInfluencerPublic = RawInfluencerDatabaseInfo &
        RawInfluencerName &
        RawInfluencerSocialMedia &
        RawInfluencerCompanyInfo;

    export type RawInfluencerPrivate = RawInfluencerDatabaseInfo &
        RawInfluencerContactInfo &
        RawInfluencerNotes;

    export type RawInfluencerDatabaseInfo = {
        id: string;
        createdAt?: string;
        updatedAt?: string;
    };
    export type RawInfluencerContactInfo = {
        email: Nullable<string>;
        phoneNumber: Nullable<string>;
        emailType: Nullable<string>;
    };

    export type RawInfluencerName = {
        firstName: string;
        lastName: string;
    };
    export type RawInfluencerCompanyInfo = {
        company: Nullable<string>;
        companyPosition: Nullable<string>;
        industry: Nullable<string>;
    };
    export type RawInfluencerSocialMedia = {
        topic: Nullable<string>[];
        linkedinProfile: Nullable<string>;
        followers: Nullable<number>;
    };
    export type RawInfluencerNotes = {
        notes: Nullable<string>;
    };
    //#endregion
    //########################################

    //########################################
    //#region Timeline Event Types
    export type RawTimeLineEventFull = RawTimelineEvent &
        RawTimelineEventWithRelatedEvents &
        RawTimelineEventWithAssignments &
        RawTimelineEventWithDetails &
        RawTimelineEventWithTriggers;

    export type RawTimelineEvent = {
        id: string;
        timelineEventType: string;
        campaign: { id: string };
        eventAssignmentAmount: Nullable<number>;
        eventTitle: Nullable<string>;
        eventTaskAmount: Nullable<number>;
        date: Nullable<string>;
        notes: Nullable<string>;
    };

    export type TimelineEventWithCampaignId = RawTimelineEvent & { campaign: { id: string } };

    export type RawTimelineEventWithRelatedEvents = RawTimelineEvent & {
        relatedEvents: { id: string; timelineEventType: TimelineEvent.eventType }[];
        timelineEventRelatedEventsId: Nullable<string>;
    };

    export type RawTimelineEventWithAssignments = RawTimelineEvent & {
        assignments: {
            influencerAssignment: RawAssignmentWithInfluencer;
        }[];
    };

    export type RawTimelineEventWithDetails = RawTimelineEvent & {
        details: TimelineEventDetails;
    };

    export type RawTimelineEventWithTriggers = RawTimelineEvent & {
        emailTriggers: RawEmailTrigger[];
    };

    type TimelineEventDetails = {
        topic: Nullable<string>;
        charLimit: Nullable<number>;
        draftDeadline: Nullable<string>;
        instructions: Nullable<string>;
        maxDuration: Nullable<number>;
    };

    //#endregion type definitions
    //########################################

    //########################################
    //#region Customer Types
    export type RawCustomer = {
        id: string;
        company: string;
        firstName: string;
        lastName: string;
        companyPosition: Nullable<string>;
        notes: Nullable<string>;
        email: string;
        substitutes: RawCustomer[];
    };

    //#endregion
    //########################################

    //########################################
    //#region Email Trigger Types
    export type RawEmailTrigger = {
        id: string;
        type: string;
        date: string;
        event: {
            id: string;
            assignments: {
                influencerAssignment: {
                    influencer: {
                        id: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        emailType: string;
                    };
                };
            }[];
        };
    };
}
