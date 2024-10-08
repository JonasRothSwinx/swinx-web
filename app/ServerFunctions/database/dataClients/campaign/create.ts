import { Campaign } from "@/app/ServerFunctions/types";
import { database } from "@database";
import { dataClient } from "@dataClient";

/**
 * Create a new campaign and update queryClient cache
 * @param campaign The campaign object to create
 * @returns The created campaign object
 */
interface CreateCampaignParams {
    campaign: Omit<Campaign, "id">;
    projectManagerId: string;
}
export async function createCampaign({
    campaign,
    projectManagerId,
}: CreateCampaignParams): Promise<Campaign> {
    const queryClient = dataClient.config.getQueryClient();
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
