"use server";
import { Campaigns } from "@/app/ServerFunctions/types";
import { client } from "../_dbclient";
import { selectionSet, selectionSetReferences } from "./_config";
import { validate } from "./validate";
import { LocalConvenienceStoreTwoTone } from "@mui/icons-material";

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
    filters?: {
        managerIds?: string[];
    };
}
export async function listRef({
    verbose,
    filters: { managerIds = [] } = {},
}: ListParams): Promise<Campaigns.Referential[]> {
    if (verbose) console.log("Listing campaigns");
    // const filterNumber = filters !== undefined ? Object.keys(filters).length : 0;
    // let filterData = {};
    // if (filterNumber > 1) {
    // } else if (filterNumber === 1) {
    //     if (filters?.managerIds !== undefined) {
    //         filterData = {
    //             projectManagerIds: { in: filters.managerIds },
    //         };
    //     }
    // }
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: selectionSetReferences,
        // filter: {
        //     and: { "projectManagers.projectManager.id": { eq: managerIds[0] } },
        // },
    });
    // const response = await client.graphql({
    //     query: /*GraphQl */ `query { campaigns { id projectManagers { projectManager { id } } } }`,
    // });

    // console.log("graphqlResponse:", { response });
    if (verbose) console.log("Campaigns listed", { data, errors });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaign = await validate.referential.many(data);
    return campaign;
}
export async function listRefByManagerIds(managerIds: string[]): Promise<Campaigns.Referential[]> {
    if (managerIds.length === 0) return [];
    const { data, errors } = await client.models.ProjectManagerCampaignAssignment.list({
        filter: {
            or: [
                ...managerIds.map((id) => {
                    return { projectManagerId: { eq: id } };
                }),
            ],
        },
        selectionSet: [
            //
            "campaign.id",
            "campaign.notes",
            "campaign.budget",
            "campaign.customers.id",
            "campaign.billingAdress.*",
            "campaign.projectManagers.projectManager.id",
            "campaign.assignedInfluencers.id",
            "campaign.timelineEvents.id",
            "campaign.timelineEvents.timelineEventType",
        ] as const,
    });
    console.log({ data, errors, managerIds });

    const campaigns = validate.referential.many(data.map((x) => x.campaign));

    return campaigns;
}
