"use server";

import client from "./.dbclient";
import { customers, timelineEvents } from "../dbInterface";
import Campaign from "../types/campaign";
import Assignment from "../types/assignment";
import Influencer from "../types/influencer";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

export async function createNewCampaign(campaign: Campaign.Campaign) {
    const { campaignManagerId, notes } = campaign;
    // if (!customer) throw new Error("Missing Data");

    const customerResponse = customers.create(campaign.customer);
    const { data, errors } = await client.models.Campaign.create({
        campaignManagerId,
        campaignCustomerId: (await customerResponse).data.id,
        notes,
    });
    return { errors };
    // const campaignNew = await client.models.Campaign.create({
    //     campaignType,
    //     customer: customerData,
    //     webinar: webinarData,
    //     campaignStep: campaignSteps[0],
    // });
    // console.log(campaignNew);
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
const selectionSet = [
    //
    "id",
    // "campaignType",
    "campaignManagerId",
    // "campaignStep",
    "notes",

    "customer.*",

    "campaignTimelineEvents.*",
    "campaignTimelineEvents.campaign.id",

    "campaignTimelineEvents.assignment.*",
    "campaignTimelineEvents.assignment.influencer.id",
    "campaignTimelineEvents.assignment.influencer.firstName",
    "campaignTimelineEvents.assignment.influencer.lastName",
    "campaignTimelineEvents.inviteEvent.*",

    "assignedInfluencers.*",
    "assignedInfluencers.candidates.id",
    "assignedInfluencers.candidates.response",
    "assignedInfluencers.candidates.influencer.id",
    "assignedInfluencers.candidates.influencer.firstName",
    "assignedInfluencers.candidates.influencer.lastName",
    "assignedInfluencers.candidates.influencer.details.id",
    "assignedInfluencers.candidates.influencer.details.email",
    "assignedInfluencers.influencer.*",
    "assignedInfluencers.influencer.details.*",
] as const;

function validateCampaign(
    rawData: SelectionSet<Schema["Campaign"], typeof selectionSet>,
): Campaign.Campaign {
    const dataOut: Campaign.Campaign = {
        id: rawData.id,
        campaignManagerId: rawData.campaignManagerId,
        notes: rawData.notes,
        customer: rawData.customer,
        campaignTimelineEvents: rawData.campaignTimelineEvents.map((x) => ({
            ...x,
            assignment: x.assignment,
        })),
        // assignedInfluencers: [],
        assignedInfluencers: rawData.assignedInfluencers.map((assignment) => {
            const candidates: Influencer.Candidate[] = assignment.candidates.map((candidate) => {
                const validCandidate: Influencer.Candidate = {
                    // ...candidate,
                    id: candidate.id,
                    response: candidate.response ?? "pending",
                    influencer: {
                        ...candidate.influencer,
                        details: candidate.influencer.details,
                    },
                };
                return candidate;
            });
            const validatedAssignment: Assignment.AssignmentFull = {
                ...assignment,
                timelineEvents: [],
                candidates,
            };
            return validatedAssignment;
        }),
    };
    return dataOut;
}
export async function getCampaign(
    id: string,
    options: GetCampaignOptions = GetCampaignOptionsDefault,
): Promise<Campaign.Campaign> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
            selectionSet,
        },
    );
    const dataOut = validateCampaign(data);
    // console.log(dataOut);
    return dataOut;
}
export async function listCampaigns(): Promise<{ data: Campaign.Campaign[]; errors: any }> {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        return { data: [], errors: errors };
    }
    const campaigns: Campaign.Campaign[] = data
        .map((raw) => {
            try {
                return validateCampaign(raw);
            } catch (error) {
                console.log(error);
                return null;
            }
        })
        .filter((x): x is Campaign.Campaign => x !== null);

    return { data: campaigns, errors };
}

export async function deleteCampaign(campaign: Campaign.Campaign) {
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
