"use server";

import client from "./.dbclient";
import { assignments, customers, timelineEvents } from ".";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Nullable, PartialWith } from "@/app/Definitions/types";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import AssignedInfluencer from "@/app/Pages/CampaignDetails/Components/OpenInfluencerDetails/AssignedInfluencer";

const selectionSet = [
    //
    "id",
    "campaignManagerId",
    "notes",
    "budget",
    "customers.*",
    "billingAdress.*",
] as const;

type RawCampaign = SelectionSet<Schema["Campaign"], typeof selectionSet>;
export async function dummyListCampaigns() {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: [
            "id",
            "campaignManagerId",
            "notes",

            "customers.*",

            "billingAdress.*",

            // "timelineEvents.*",
            // "timelineEvents.campaign.id",
            // "timelineEvents.relatedEvents.id",
            // "timelineEvents.relatedEvents.timelineEventType",
            // "timelineEvents.Id",

            // "campaignTimelineEvents.assignments.*",
            // "campaignTimelineEvents.assignments.influencer.*",
            // "campaignTimelineEvents.assignments.influencer.firstName",
            // "campaignTimelineEvents.assignments.influencer.lastName",
            // "campaignTimelineEvents.inviteEvent.*",

            // "assignedInfluencers.*",
            // "assignedInfluencers.candidates.id",
            // "assignedInfluencers.candidates.response",
            // "assignedInfluencers.candidates.influencer.id",
            // "assignedInfluencers.candidates.influencer.firstName",
            // "assignedInfluencers.candidates.influencer.lastName",
            // "assignedInfluencers.candidates.influencer.email",
            // "assignedInfluencers.influencer.*",
        ],
    });
    return { data: JSON.parse(JSON.stringify(data)), errors };
}

/**
 * Create a new campaign
 * @param campaign The campaign data without an id
 * @returns The id of the created campaign
 */
export async function createNewCampaign(campaign: Omit<Campaign.Campaign, "id">) {
    const { campaignManagerId, notes, budget } = campaign;
    // if (!customer) throw new Error("Missing Data");

    // const customerResponse = customers.create(campaign.customers);
    const { data: createdCampaign, errors } = await client.models.Campaign.create({
        campaignManagerId,
        notes,
        budget,
        billingAdress: campaign.billingAdress ?? undefined,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    //Create Customers
    const customersResponses = await Promise.all(
        campaign.customers.map((customer) => customers.create(customer, createdCampaign.id)),
    );

    return createdCampaign.id;
}
interface GetCampaignOptions {
    include: {
        customer?: boolean;
        timelineEvents?: boolean;
    };
}
const GetCampaignOptionsDefault: GetCampaignOptions = {
    include: { customer: true, timelineEvents: true },
};

function validateCampaign(rawCampaign: RawCampaign): Campaign.CampaignMin {
    const dataOut: Campaign.CampaignMin = {
        id: rawCampaign.id,
        campaignManagerId: rawCampaign.campaignManagerId,
        notes: rawCampaign.notes,
        customers: rawCampaign.customers,
        billingAdress: rawCampaign.billingAdress ?? null,
    };
    return dataOut;
}
export async function getCampaign(id: string): Promise<Campaign.CampaignMin> {
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

    const dataOut = validateCampaign(data);
    // console.log(dataOut);
    return dataOut;
}

export async function listCampaigns(): Promise<Campaign.CampaignMin[]> {
    const { data, errors } = await client.models.Campaign.list({
        // ts-expect-error - This is a valid selectionSet
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaigns: Campaign.CampaignMin[] = data
        .map((raw) => {
            try {
                return validateCampaign(raw);
            } catch (error) {
                console.log(error);
                return null;
            }
        })
        .filter((x: Campaign.CampaignMin | null): x is Campaign.CampaignMin => x !== null);

    return campaigns;
}

export async function deleteCampaign(
    campaign: PartialWith<Campaign.Campaign, "id" | "customers" | "campaignTimelineEvents">,
) {
    if (!campaign.id) throw new Error("Missing Data");

    const tasks: Promise<unknown>[] = [];
    //Remove Customer
    // tasks.push(customers.delete(campaign.customers));

    //Remove TimelineEvents
    // tasks.push(...campaign.campaignTimelineEvents.map((event) => timelineEvents.delete(event)));

    tasks.push(client.models.Campaign.delete({ id: campaign.id }));

    await Promise.all(tasks);
}
//#endregion
