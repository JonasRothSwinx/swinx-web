import { Nullable, Prettify } from "@/app/Definitions/types";
import Customer from "./customer";
import Influencer from "./influencer";
import TimelineEvent from "./timelineEvents";
import Assignment from "./assignment";

export default Campaign;
namespace Campaign {
    /**
     * A campaign is a project that is managed by a campaign manager.
     * It can have multiple customers and multiple influencers assigned to it.
     * The first customer is the primary contact, the rest are substitutes.
     * The campaign can have a budget and a billing address.
     * The campaign can have multiple timeline events.
     * The campaign can have notes.
     */
    export type Campaign = Prettify<CampaignFull>;

    export type CampaignMin = {
        id: string;
        // campaignType: string;
        campaignManagerId?: Nullable<string>;
        customers: Customer.Customer[];
        billingAdress: Nullable<BillingAdress>;
        // campaignStep: string;
        notes?: Nullable<string>;
        budget?: Nullable<number>;
    };

    export type CampaignWithReferences = CampaignMin & {
        assignedInfluencers: Assignment.AssignmentWithReferences[];
        billingAdress: BillingAdress;
        campaignTimelineEvents: TimelineEvent.EventReference[];
    };

    export type CampaignFull = CampaignMin & {
        assignedInfluencers: Assignment.AssignmentFull[];
        billingAdress: Nullable<BillingAdress>;
        campaignTimelineEvents: TimelineEvent.Event[];
    };

    export type BillingAdress = {
        name: string;
        street: string;
        city: string;
        zip: string;
    };

    // export type WebinarCampaign = {
    //     webinar: Webinar;
    // } & CampaignStub;
    // export function isWebinar(campaign: Campaign): campaign is WebinarCampaign {
    //     return ["webinar"].every((x) => x in campaign);
    // }
}
