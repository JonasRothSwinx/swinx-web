import { Campaign, Campaigns } from "@/app/ServerFunctions/types";
import { database } from "@database";
import { dataClient } from "@dataClient";
import { queryKeys } from "@/app/(main)/queryClient/keys";
import { listRef as listRefDirect } from "../../dbOperations/campaigns/list";

/**
 * List all campaigns, resolve Data References and update queryClient cache
 * @returns The list of campaigns
 */
export async function listCampaigns(): Promise<Campaign[]> {
    const queryClient = dataClient.config.getQueryClient();
    //Return cached data if available
    // const cachedData = queryClient.getQueryData<Campaign[]>(["campaigns"]);
    // if (cachedData) return cachedData;

    const campaigns = await database.campaign.list();
    const resolvedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
            const resolvedCampaign = await resolveCampaignReferences(campaign);
            queryClient.setQueryData(queryKeys.campaign.one(resolvedCampaign.id), resolvedCampaign);
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
interface ListParams {
    verbose?: boolean;
    filters?: {
        managerIds?: string[];
    };
}
export async function listRef({ verbose = false, filters }: ListParams = {}): Promise<
    Campaigns.Referential[]
> {
    // debugger;
    const queryClient = dataClient.config.getQueryClient();
    if (verbose) console.log("Listing campaigns");
    const campaigns = (await listRefDirect({ verbose })).filter((campaign) => {
        // debugger;
        let valid = true;
        if (!filters) return valid;
        if (filters.managerIds) {
            valid = filters.managerIds.some((managerId) =>
                campaign.projectManagerIds.includes(managerId),
            );
            if (!valid) return false;
        }
        return valid;
    });
    // const campaigns = await database.campaign.listRef(verbose);

    if (verbose) console.log("Campaigns listed", campaigns);
    campaigns.forEach((campaign) => {
        queryClient.setQueryData(queryKeys.campaign.one(campaign.id), campaign);
    });
    return campaigns;
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
