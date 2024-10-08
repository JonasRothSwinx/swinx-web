"use server";
import { Campaign } from "@/app/ServerFunctions/types";
import { database } from "@database";
import { client } from "../_dbclient";

/**
 * Create a new campaign
 * @param campaign The campaign data without an id
 * @returns The id of the created campaign
 */
interface CreateNewCampaignParams {
    campaign: Omit<Campaign, "id">;
    projectManagerId: string;
}
export async function createNewCampaign({ campaign, projectManagerId }: CreateNewCampaignParams) {
    const { notes, budget } = campaign;
    // if (!customer) throw new Error("Missing Data");

    // const customerResponse = customers.create(campaign.customers);
    const { data: createdCampaign, errors } = await client.models.Campaign.create({
        notes,
        budget,
        billingAdress: campaign.billingAdress ?? undefined,
    });
    if (errors || createdCampaign === null) {
        throw new Error(JSON.stringify(errors));
    }
    //Create Customers
    const customersResponses = await Promise.all(
        campaign.customers.map((customer) =>
            database.customer.create(customer, createdCampaign.id),
        ),
    );
    //Connect projectManager
    const managerRespone = await database.campaign.connect.toManager({
        campaignId: createdCampaign.id,
        projectManagerId,
    });

    return createdCampaign.id;
}
