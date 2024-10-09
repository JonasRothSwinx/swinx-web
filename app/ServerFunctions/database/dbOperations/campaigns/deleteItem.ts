"use server";
import { PartialWith } from "@/app/Definitions/types";
import { Campaign } from "@/app/ServerFunctions/types";
import { database } from "@database";
import { client } from "../_dbclient";

export async function deleteCampaign(
    campaign: PartialWith<Campaign, "id" | "customers" | "campaignTimelineEvents">,
) {
    if (!campaign.id) throw new Error("Missing Data");

    const tasks: Promise<unknown>[] = [];
    //Remove Customer
    tasks.push(
        ...campaign.customers.map((customer) => {
            if (!customer.id) return Promise.resolve();
            return database.customer.delete({ id: customer.id });
        }),
    );

    //Remove TimelineEvents
    tasks.push(
        ...campaign.campaignTimelineEvents.map((event) => {
            if (!event.id) return Promise.resolve();
            return database.timelineEvent.delete({ id: event.id });
        }),
    );

    await Promise.all(tasks);
    await client.models.Campaign.delete({ id: campaign.id });
}
export async function deleteCampaignRef(
    campaignId: string,
    customerIds: string[],
    eventIds: string[],
) {
    const tasks: Promise<unknown>[] = [];
    tasks.push(client.models.Campaign.delete({ id: campaignId }));
    tasks.push(...customerIds.map((id) => database.customer.delete({ id })));
    tasks.push(...eventIds.map((id) => database.timelineEvent.delete({ id })));
    await Promise.all(tasks);
    return;
}
