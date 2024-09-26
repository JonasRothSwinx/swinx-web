import { dataClient } from "..";
import { Campaign, Campaigns } from "../../types";
import database from "../dbOperations";
import { PartialWith } from "@/app/Definitions/types";
import { config, customer } from ".";

/**
 * Campaign database operations
 * @param create Create a new campaign
 * @param list List all campaigns
 */

export const campaign = {
    create: createCampaign,
    list: listCampaigns,
    get: getCampaign,
    delete: deleteCampaign,
};

/**
 * Create a new campaign and update queryClient cache
 * @param campaign The campaign object to create
 * @returns The created campaign object
 */
interface CreateCampaignParams {
    campaign: Omit<Campaign, "id">;
    projectManagerId: string;
}
async function createCampaign({
    campaign,
    projectManagerId,
}: CreateCampaignParams): Promise<Campaign> {
    const queryClient = config.getQueryClient();
    const id = await database.campaign.create({ campaign, projectManagerId });
    if (!id) throw new Error("Failed to create campaign");
    const createdCampaign = { ...campaign, id };
    queryClient.setQueryData(["campaign", id], { ...campaign, id });
    queryClient.setQueryData(["campaigns"], (prev: Campaign[]) => {
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
 * @returns The list of campaigns
 */
async function listCampaigns(): Promise<Campaign[]> {
    const queryClient = config.getQueryClient();
    //Return cached data if available
    // const cachedData = queryClient.getQueryData<Campaign[]>(["campaigns"]);
    // if (cachedData) return cachedData;

    const campaigns = await database.campaign.list();
    const resolvedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
            const resolvedCampaign = await resolveCampaignReferences(campaign);
            queryClient.setQueryData(["campaign", campaign.id], resolvedCampaign);
            resolvedCampaign.customers.map((customer) => {
                queryClient.cancelQueries({ queryKey: ["customer", customer.id] });
                queryClient.setQueryData(["customer", customer.id], customer);
            });

            // queryClient.refetchQueries({ queryKey: ["campaign", campaign.id] });
            return resolvedCampaign;
        }),
    );

    return resolvedCampaigns;
}

/**
 * Get a campaign by id
 * @param id The id of the campaign to get
 * @returns The campaign object
 */
async function getCampaign(id: string): Promise<Campaign> {
    const queryClient = config.getQueryClient();
    const campaign = await database.campaign.get(id);
    if (!campaign) throw new Error("Campaign not found");
    const resolvedCampaign = await resolveCampaignReferences(campaign);
    return resolvedCampaign;
}

/**
 * Delete a campaign by id
 * @param campaign The campaign object. needs to contain id, customer and timelineEvents
 */
async function deleteCampaign(
    campaign: PartialWith<Campaign, "id" | "customers" | "campaignTimelineEvents">,
): Promise<void> {
    const queryClient = config.getQueryClient();
    const { id } = campaign;
    await database.campaign.delete(campaign);
}

/**
 * Resolve CampaignMin to CampaignFull
 * @param campaign The campaign to resolve
 * @returns The resolved campaign object
 */

async function resolveCampaignReferences(campaign: Campaigns.Min): Promise<Campaign> {
    const queryClient = config.getQueryClient();
    const timelineEvents = dataClient.timelineEvent.byCampaign(campaign.id);
    const assignments = dataClient.assignment.byCampaign(campaign.id);

    const resolvedCampaign: Campaign = {
        ...campaign,
        campaignTimelineEvents: await timelineEvents,
        assignedInfluencers: await assignments,
    };
    return resolvedCampaign;
}
