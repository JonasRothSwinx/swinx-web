import { queryKeys } from "@/app/(main)/queryClient/keys";
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
interface DeleteCampaignRef {
    campaignId: string;
    customerIds: string[];
    eventIds: string[];
}
export async function deleteCampaignRef({
    campaignId,
    customerIds,
    eventIds,
}: DeleteCampaignRef): Promise<void> {
    const queryClient = dataClient.config.getQueryClient();

    //Update campaign Cache
    queryClient.invalidateQueries({ queryKey: queryKeys.campaign.one(campaignId) });
    queryClient.setQueryData(queryKeys.campaign.all, (oldData: Campaign[]) => {
        return oldData.filter((campaign) => campaign.id !== campaignId);
    });

    //Update Customer Cache
    customerIds.forEach((customerId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customer.one(customerId) });
    });
    queryClient.setQueryData(queryKeys.customer.all, (oldData: Campaign[]) => {
        return oldData.filter((customer) => !customerIds.includes(customer.id));
    });

    //Update Event Cache
    eventIds.forEach((eventId) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.event.one(eventId) });
    });
    queryClient.setQueryData(queryKeys.event.all, (oldData: Campaign[]) => {
        return oldData.filter((event) => !eventIds.includes(event.id));
    });
    await database.campaign.deleteRef(campaignId, customerIds, eventIds);
}
