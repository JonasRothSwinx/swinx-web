"use server";
import { Nullable } from "@/app/Definitions/types";
import { client } from "../_dbclient";
import { selectionSet, selectionSetReferences } from "./_config";
import { Campaigns } from "@/app/ServerFunctions/types";
import { validate } from "./validate";

/**
 * @deprecated
 */
export async function getCampaign(id: string): Promise<Nullable<Campaigns.Min>> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
            selectionSet,
        },
    );
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify(errors));
    }

    const dataOut = validate.full.one(data);
    // console.log(dataOut);
    return dataOut;
}

/**
 * get a campaign with idd-references to all connected objects
 * @param id
 */

export async function getCampaignWithReferences(
    id: string,
): Promise<Nullable<Campaigns.Referential>> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
            selectionSet: selectionSetReferences,
        },
    );
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify(errors));
    }
    const validatedData = validate.referential.one(data);
    return validatedData;
    throw new Error("Not Implemented");
}
