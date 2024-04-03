import { QueryClient } from "@tanstack/react-query";
import dataClient from "..";
import Campaign from "../../types/campaign";
import database from "../dbOperations/.database";
import { PartialWith } from "@/app/Definitions/types";

/**
 * Create a new campaign and update queryClient cache
 * @param campaign The campaign object to create
 * @param queryClient The query client to use for updating the cache
 * @returns The created campaign object
 */
async function createCampaign(
    campaign: Omit<Campaign.CampaignFull, "id">,
    queryClient: QueryClient,
): Promise<Campaign.CampaignFull> {
    const id = await database.campaign.create(campaign);
    const createdCampaign = { ...campaign, id };
    queryClient.setQueryData(["campaign", id], { ...campaign, id });
    queryClient.setQueryData(["campaigns"], (prev: Campaign.CampaignFull[]) => {
        if (!prev) {
            return [createdCampaign];
        }
        return [...prev, createdCampaign];
    });
    queryClient.refetchQueries({ queryKey: ["campaigns"] });
    queryClient.refetchQueries({ queryKey: ["campaign", id] });
    return createdCampaign;
}

/**
 * List all campaigns, resolve Data References and update queryClient cache
 * @param queryClient The query client to use for updating the cache
 * @returns The list of campaigns
 */
async function listCampaigns(queryClient: QueryClient): Promise<Campaign.CampaignFull[]> {
    //Return cached data if available
    const cachedData = queryClient.getQueryData<Campaign.CampaignFull[]>(["campaigns"]);
    if (cachedData) return cachedData;

    const campaigns = await database.campaign.list();
    const resolvedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
            const resolvedCampaign = await resolveCampaignReferences(campaign, queryClient);
            queryClient.setQueryData(["campaign", campaign.id], resolvedCampaign);
            queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });
            return resolvedCampaign;
        }),
    );

    return resolvedCampaigns;
}

/**
 * Get a campaign by id
 * @param id The id of the campaign to get
 * @param queryClient The query client to use for updating the cache
 * @returns The campaign object
 */
async function getCampaign(id: string, queryClient: QueryClient): Promise<Campaign.CampaignFull> {
    const campaign = await database.campaign.get(id);
    const resolvedCampaign = await resolveCampaignReferences(campaign, queryClient);
    return resolvedCampaign;
}

/**
 * Delete a campaign by id
 * @param campaign The campaign object. needs to contain id, customer and timelineEvents
 * @param queryClient The query client to use for updating the cache
 */
async function deleteCampaign(
    campaign: PartialWith<Campaign.CampaignFull, "id" | "customer" | "campaignTimelineEvents">,
    queryClient: QueryClient,
): Promise<void> {
    const { id } = campaign;
    await database.campaign.delete(campaign);
    queryClient.setQueryData(["campaigns"], (prev: Campaign.CampaignFull[]) => {
        if (!prev) return [];
        return prev.filter((campaign) => campaign.id !== id);
    });
    queryClient.refetchQueries({ queryKey: ["campaigns"] });
}

/**
 * Resolve CampaignMin to CampaignFull
 * @param campaign The campaign to resolve
 * @param queryClient The query client to use for updating the cache
 * @returns The resolved campaign object
 */

async function resolveCampaignReferences(
    campaign: Campaign.CampaignMin,
    queryClient: QueryClient,
): Promise<Campaign.CampaignFull> {
    const timelineEvents = dataClient.timelineEvent.byCampaign(campaign.id, queryClient);
    const assignments = dataClient.assignment.byCampaign(campaign.id, queryClient);

    const resolvedCampaign: Campaign.CampaignFull = {
        ...campaign,
        campaignTimelineEvents: await timelineEvents,
        assignedInfluencers: await assignments,
    };
    return resolvedCampaign;
}

/**
 * Campaign database operations
 * @param create Create a new campaign
 * @param list List all campaigns
 */

const campaigns = {
    create: createCampaign,
    list: listCampaigns,
    get: getCampaign,
    delete: deleteCampaign,
};
export default campaigns;
