import { PartialWith } from "@/app/Definitions/types";
import { Campaign } from "@/app/ServerFunctions/types";
import { dataClient } from "@dataClient";
import { database } from "@database";
/**
 * Delete a campaign by id
 * @param campaign The campaign object. needs to contain id, customer and timelineEvents
 */
export async function deleteCampaign(
    campaign: PartialWith<Campaign, "id" | "customers" | "campaignTimelineEvents">,
): Promise<void> {
    const queryClient = dataClient.config.getQueryClient();
    const { id } = campaign;
    await database.campaign.delete(campaign);
}
