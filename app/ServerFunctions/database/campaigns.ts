"use server";

import client from "./.dbclient";
import { assignments, customers, timelineEvents } from "./.dbInterface";
import Campaign from "../types/campaign";
import Assignment from "../types/assignment";
import Influencer from "../types/influencer";
import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import TimelineEvent from "../types/timelineEvents";

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

function dummy() {
    client.models.Campaign.list({
        selectionSet: [
            "id",
            // "campaignType",
            "campaignManagerId",
            // "campaignStep",
            "notes",

            "customer.*",

            "campaignTimelineEvents.*",
            "campaignTimelineEvents.campaign.id",

            "campaignTimelineEvents.assignments.*",
            // "campaignTimelineEvents.assignments.influencer.id",
            // "campaignTimelineEvents.assignments.influencer.firstName",
            // "campaignTimelineEvents.assignments.influencer.lastName",
            // "campaignTimelineEvents.inviteEvent.*",

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
        ],
    });
}
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

    "campaignTimelineEvents.assignments.*",
    // "campaignTimelineEvents.assignments.influencerassignment.influencer.id",
    // "campaignTimelineEvents.assignments.influencerassignment.influencer.firstName",
    // "campaignTimelineEvents.assignments.influencerassignment.influencer.lastName",
    // "campaignTimelineEvents.inviteEvent.*",

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
function validateCampaign(rawData: SelectionSet<Schema["Campaign"], typeof selectionSet>): Campaign.Campaign {
    // console.log({ rawData });
    const dataOut: Campaign.Campaign = {
        id: rawData.id,
        campaignManagerId: rawData.campaignManagerId,
        notes: rawData.notes,
        customer: rawData.customer,
        campaignTimelineEvents: rawData.campaignTimelineEvents.map((x) => {
            const { id, timelineEventType, date, notes, assignments } = x;
            if (!id) throw new Error("Missing ID");
            if (!TimelineEvent.isTimelineEventType(timelineEventType)) throw new Error("Invalid Type");
            switch (true) {
                case TimelineEvent.isSingleEventType(timelineEventType): {
                    const assignment: Assignment.AssignmentMin = { ...assignments[0], influencer: null };
                    if (!assignment) throw new Error("Missing Assignment");
                    const dataOut: TimelineEvent.SingleEvent = {
                        id,
                        type: timelineEventType,
                        date: date ?? undefined,
                        notes,
                        campaign: { id: x.campaign.id },
                        assignment: assignment,
                        eventAssignmentAmount: 1,
                        eventTaskAmount: x.eventTaskAmount,
                        eventTitle: x.eventTitle,
                    };
                    return dataOut;
                }
                case TimelineEvent.isMultiEventType(timelineEventType): {
                    const assignments: Assignment.AssignmentMin[] = x.assignments.map((assignment) => {
                        if (!assignment) throw new Error("Missing Assignment");
                        return { ...assignment, influencer: null };
                    });
                    const dataOut: TimelineEvent.MultiEvent = {
                        id,
                        type: timelineEventType,
                        date: date ?? undefined,
                        notes,
                        assignments: assignments,
                        campaign: { id: x.campaign.id },
                        eventAssignmentAmount: x.eventAssignmentAmount ?? 1,
                        eventTaskAmount: x.eventTaskAmount ?? null,
                        eventTitle: x.eventTitle,
                    };
                    return dataOut;
                }
                default: {
                    throw new Error("Invalid Type");
                }
            }
        }),
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
    options: GetCampaignOptions = GetCampaignOptionsDefault
): Promise<Campaign.Campaign> {
    const { data, errors } = await client.models.Campaign.get(
        { id },
        {
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
export async function listCampaigns(): Promise<Campaign.Campaign[]> {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }

    // return [
    //     {
    //         id: "123",
    //         campaignManagerId: "123",
    //         notes: "notes",
    //         customer: {
    //             id: "123",
    //             firstName: "firstName",
    //             lastName: "lastName",
    //             email: "email",
    //             company: "company",
    //         },
    //         campaignTimelineEvents: [
    //             {
    //                 id: "123",
    //                 type: "Invites",
    //                 date: "date",
    //                 notes: "notes",
    //                 campaign: { id: "123" },
    //                 assignment: {
    //                     id: "123",
    //                     placeholderName: "placeholderName",
    //                     // budget: 123,
    //                     // timelineEvents: [],
    //                     isPlaceholder: true,
    //                     influencer: null,
    //                 },
    //                 eventAssignmentAmount: 1,
    //                 eventTaskAmount: 1,
    //                 eventTitle: "eventTitle",
    //             },
    //         ],
    //         assignedInfluencers: [],
    //     },
    // ];
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

    return campaigns;
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
