import { database } from "@database";
import { dataClient } from "@dataClient";
import { Campaign, Campaigns } from "@/app/ServerFunctions/types";

/**
 * Get a campaign by id
 * @param id The id of the campaign to get
 * @returns The campaign object
 * @deprecated switch to referential version
 */
export async function getCampaign(id: string): Promise<Campaign> {
    const queryClient = dataClient.config.getQueryClient();
    const campaign = await database.campaign.get(id);
    if (!campaign) throw new Error("Campaign not found");
    const resolvedCampaign = await resolveCampaignReferences(campaign);
    return resolvedCampaign;
}

/**
 * Get a campaign by id
 * All connected objects are only id references
 *
 * @param id
 */
export async function getCampaignWithIds(id: string): Promise<Campaigns.Referential> {
    // const campaign = await database.campaign.
    throw new Error("Not Implemented");
}
/**
 * Resolve CampaignMin to CampaignFull
 * @param campaign The campaign to resolve
 * @returns The resolved campaign object
 */

async function resolveCampaignReferences(campaign: Campaigns.Min): Promise<Campaign> {
    const queryClient = dataClient.config.getQueryClient();
    const timelineEvents = dataClient.event.list.by.campaign({ campaignId: campaign.id });
    const assignments = dataClient.assignment.byCampaign(campaign.id);

    const resolvedCampaign: Campaign = {
        ...campaign,
        campaignTimelineEvents: await timelineEvents,
        assignedInfluencers: await assignments,
    };
    return resolvedCampaign;
}
