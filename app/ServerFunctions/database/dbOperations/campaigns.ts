"use server";

import client from "./.dbclient";
import { assignments, customers, timelineEvents } from "./.database";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Nullable, PartialWith } from "@/app/Definitions/types";
import { RawData } from "./types";
import { Candidates } from "@/app/ServerFunctions/types/candidates";
import AssignedInfluencer from "@/app/Pages/CampaignDetails/Components/OpenInfluencerDetails/AssignedInfluencer";

const selectionSet = [
    //
    "id",
    "campaignManagerId",
    "notes",

    "customer.*",
    "customer.substitutes.*",

    "campaignTimelineEvents.*",
    "campaignTimelineEvents.campaign.id",
    "campaignTimelineEvents.relatedEvents.id",
    "campaignTimelineEvents.relatedEvents.timelineEventType",
    "campaignTimelineEvents.timelineEventRelatedEventsId",

    "campaignTimelineEvents.assignments.*",
    "campaignTimelineEvents.assignments.influencerAssignment.influencer.*",
    // "campaignTimelineEvents.inviteEvent.*",

    // "assignedInfluencers.*",
    // "assignedInfluencers.candidates.id",
    // "assignedInfluencers.candidates.response",
    // "assignedInfluencers.candidates.influencer.id",
    // "assignedInfluencers.candidates.influencer.firstName",
    // "assignedInfluencers.candidates.influencer.lastName",
    // "assignedInfluencers.candidates.influencer.email",
    // "assignedInfluencers.influencer.*",
] as const;
export async function createNewCampaign(campaign: Omit<Campaign.Campaign, "id">) {
    const { campaignManagerId, notes } = campaign;
    // if (!customer) throw new Error("Missing Data");

    const customerResponse = customers.create(campaign.customer);
    const { data, errors } = await client.models.Campaign.create({
        campaignManagerId,
        campaignCustomerId: await customerResponse,
        notes,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
    return data.id;
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

export async function dummyListCampaigns() {
    //@ts-expect-error - This is a dummy function
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: [
            "id",
            // "campaignType",
            "campaignManagerId",
            // "campaignStep",
            "notes",

            "customer.*",

            "billingAdress.*",

            "campaignTimelineEvents.*",
            "campaignTimelineEvents.campaign.id",
            "campaignTimelineEvents.relatedEvents.id",
            "campaignTimelineEvents.relatedEvents.timelineEventType",
            //@ts-expect-error - This exists in the schema
            "campaignTimelineEvents.timelineEventRelatedEventsId",

            "campaignTimelineEvents.assignments.*",
            "campaignTimelineEvents.assignments.influencer.*",
            "campaignTimelineEvents.assignments.influencer.firstName",
            "campaignTimelineEvents.assignments.influencer.lastName",
            // "campaignTimelineEvents.inviteEvent.*",

            "assignedInfluencers.*",
            "assignedInfluencers.candidates.id",
            "assignedInfluencers.candidates.response",
            "assignedInfluencers.candidates.influencer.id",
            "assignedInfluencers.candidates.influencer.firstName",
            "assignedInfluencers.candidates.influencer.lastName",
            "assignedInfluencers.candidates.influencer.email",
            "assignedInfluencers.influencer.*",
        ],
    });
    return { data: JSON.parse(JSON.stringify(data)), errors };
}

function validateCampaign(rawDataInput: unknown): Campaign.CampaignMin {
    const rawData = rawDataInput as RawData.RawCampaignFull;

    const dataOut: Campaign.CampaignMin = {
        id: rawData.id,
        campaignManagerId: rawData.campaignManagerId,
        notes: rawData.notes,
        customer: rawData.customer,
        billingAdress: {
            name: "placeholder",
            street: "placeholder",
            city: "placeholder",
            zip: "placeholder",
        },
    };
    return dataOut;
}
export async function getCampaign(id: string): Promise<Campaign.CampaignMin> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
            //@ts-expect-error - This is a valid selectionSet
            selectionSet,
        }
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
        //@ts-expect-error - This is a valid selectionSet
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaigns: Campaign.CampaignWithReferences[] = data
        .map((raw: unknown) => {
            try {
                return validateCampaign(raw);
            } catch (error) {
                console.log(error);
                return null;
            }
        })
        .filter((x: Campaign.Campaign | null): x is Campaign.Campaign => x !== null);

    return campaigns;
}

export async function deleteCampaign(
    campaign: PartialWith<Campaign.Campaign, "id" | "customer" | "campaignTimelineEvents">
) {
    if (!campaign.id) throw new Error("Missing Data");

    const tasks: Promise<unknown>[] = [];
    //Remove Customer
    tasks.push(customers.delete(campaign.customer));

    //Remove TimelineEvents
    tasks.push(...campaign.campaignTimelineEvents.map((event) => timelineEvents.delete(event)));

    //Remove Webinar

    tasks.push(client.models.Campaign.delete({ id: campaign.id }));

    await Promise.all(tasks);
}
//#endregion
