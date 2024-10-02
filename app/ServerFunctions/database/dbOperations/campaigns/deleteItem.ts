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
    tasks.push(...campaign.customers.map((customer) => database.customer.delete(customer)));

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
