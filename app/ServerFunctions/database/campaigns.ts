/* eslint-disable @typescript-eslint/ban-ts-comment */
"use server";

import client from "./.dbclient";
import { customers, timelineEvents } from "../dbInterface";
import Campaign from "../types/campaign";
import Assignment from "../types/assignment";

export async function createNewCampaign(campaign: Campaign.Campaign) {
    const { campaignManagerId, notes } = campaign;
    // if (!customer) throw new Error("Missing Data");

    const customerResponse = customers.create(campaign.customer);
    const { data, errors } = await client.models.Campaign.create({
        campaignManagerId,
        customer: (await customerResponse).data,
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
    "campaignTimelineEvents.assignment.influencer.id",
    "campaignTimelineEvents.inviteEvent.*",

    "assignedInfluencers.*",
    "assignedInfluencers.candidates.id",
    "assignedInfluencers.influencer.*",
    "assignedInfluencers.influencer.details.*",
] as const;
export async function getCampaign(
    id: string,
    options: GetCampaignOptions = GetCampaignOptionsDefault
): Promise<Campaign.Campaign> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
            selectionSet,
        }
    );
    const dataOut: Campaign.Campaign = {
        id: data.id,
        campaignManagerId: data.campaignManagerId,
        notes: data.notes,
        customer: data.customer,
        campaignTimelineEvents: options.include.timelineEvents
            ? data.campaignTimelineEvents.map((x) => ({
                  ...x,
                  assignment: x.assignment,
              }))
            : [],
        // assignedInfluencers: [],
        assignedInfluencers: data.assignedInfluencers.map((x) => {
            const validatedAssignment: Assignment.AssignmentFull = { ...x, timelineEvents: [] };
            return validatedAssignment;
        }),
    };
    console.log(dataOut);
    return dataOut;
}
export async function listCampaigns(): Promise<{ data: Campaign.Campaign[]; errors: any }> {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet,
    });
    const campaigns: Campaign.Campaign[] = data
        .map((raw) => {
            try {
                const campaign: Campaign.Campaign = {
                    id: raw.id,
                    // campaignType: raw.campaignType,
                    campaignManagerId: raw.campaignManagerId,
                    customer: raw.customer,
                    campaignTimelineEvents: raw.campaignTimelineEvents.map((x) => ({
                        ...x,
                        influencerAssignmentId: x.assignment.id,
                    })),
                    // campaignStep: raw.campaignStep,
                    notes: raw.notes,
                    assignedInfluencers: raw.assignedInfluencers.map((x) => ({ ...x, timelineEvents: [] })),
                };
                return campaign;
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
