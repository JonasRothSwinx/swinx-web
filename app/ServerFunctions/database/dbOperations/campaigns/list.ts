"use server";
import { Campaigns } from "@/app/ServerFunctions/types";
import { client } from "../_dbclient";
import { selectionSet, selectionSetReferences } from "./_config";
import { validate } from "./validate";

export async function listCampaigns(): Promise<Campaigns.Min[]> {
    const { data, errors } = await client.models.Campaign.list({
        // ts-expect-error - This is a valid selectionSet
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaigns: Campaigns.Min[] = await validate.full.many(data);

    return campaigns;
}

interface ListParams {
    verbose?: boolean;
}
export async function listRef({ verbose }: ListParams): Promise<Campaigns.Referential[]> {
    if (verbose) console.log("Listing campaigns");
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: selectionSetReferences,
    });
    if (verbose) console.log("Campaigns listed", { data, errors });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaign = await validate.referential.many(data);
    return campaign;
}
