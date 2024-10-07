import { Nullable, Prettify } from "@/app/Definitions/types";
import { Customer, Event, Events, Assignments, ProjectManager } from ".";

/**
 * A campaign is a project that is managed by a campaign manager.
 * It can have multiple customers and multiple influencers assigned to it.
 * The first customer is the primary contact, the rest are substitutes.
 * The campaign can have a budget and a billing address.
 * The campaign can have multiple timeline events.
 * The campaign can have notes.
 */
export type Campaign = Prettify<Full>;

export type Min = {
    id: string;
    // campaignType: string;
    customers: Customer[];
    billingAdress: Nullable<BillingAdress>;
    // campaignStep: string;
    notes?: Nullable<string>;
    budget?: Nullable<number>;
    projectManagers: ProjectManager[];
};

export type WithReferences = Min & {
    assignedInfluencers: Assignments.AssignmentWithReferences[];
    billingAdress: BillingAdress;
    campaignTimelineEvents: Events.EventReference[];
};

export type Full = Min & {
    assignedInfluencers: Assignments.Full[];
    billingAdress: Nullable<BillingAdress>;
    campaignTimelineEvents: Event[];
};

export type BillingAdress = {
    name: string;
    street: string;
    city: string;
    zip: string;
};

/**
 * Campaign Object that only contains the ids of child objects
 */
export type Referential = Prettify<
    Omit<Min, "projectManagers" | "customers"> & {
        assignmentIds: string[];
        events: { id: string; type: string }[];
        projectManagerIds: string[];
        customerIds: string[];
    }
>;

// export type WebinarCampaign = {
//     webinar: Webinar;
// } & CampaignStub;
// export function isWebinar(campaign: Campaign): campaign is WebinarCampaign {
//     return ["webinar"].every((x) => x in campaign);
// }
