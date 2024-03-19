import { Prettify } from "@/app/Definitions/types";
import Customer from "./customer";
import Influencer from "./influencer";
import TimelineEvent from "./timelineEvents";
import Assignment from "./assignment";
import StaticEvent from "./staticEvents";

export default Campaign;
namespace Campaign {
    export type Campaign = Prettify<CampaignStub>;

    type CampaignStub = {
        id: string;
        // campaignType: string;
        campaignManagerId?: string | null;
        customer: Customer.Customer;
        campaignTimelineEvents: TimelineEvent.Event[];
        // assignedInfluencers: Influencer.InfluencerFull[];
        assignedInfluencers: Assignment.AssignmentFull[];
        // campaignStep: string;
        notes?: string | null;
    };

    // export type WebinarCampaign = {
    //     webinar: Webinar;
    // } & CampaignStub;
    // export function isWebinar(campaign: Campaign): campaign is WebinarCampaign {
    //     return ["webinar"].every((x) => x in campaign);
    // }
}
