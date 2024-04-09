import { Nullable, Prettify } from "@/app/Definitions/types";
import Customer from "./customer";
import Influencer from "./influencer";
import TimelineEvent from "./timelineEvents";
import Assignment from "./assignment";

export default Campaign;
namespace Campaign {
    export type Campaign = Prettify<CampaignFull>;

    export type CampaignMin = {
        id: string;
        // campaignType: string;
        campaignManagerId?: Nullable<string>;
        customer: Customer.Customer;
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
        customer: Customer.Customer;
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
