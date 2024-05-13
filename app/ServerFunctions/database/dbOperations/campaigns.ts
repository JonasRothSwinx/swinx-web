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
import Customer from "../../types/customer";
import ProjectManagers from "../../types/projectManagers";

const selectionSet = [
    //
    "id",
    // "campaignManagerId",
    "notes",
    "budget",
    "customers.*",
    "billingAdress.*",
    "projectManagers.*",
    "projectManagers.projectManager.*",
] as const;

type RawCampaign = SelectionSet<Schema["Campaign"]["type"], typeof selectionSet>;

export async function dummyListCampaigns() {
    const { data, errors } = await client.models.Campaign.list({
        selectionSet: [
            "id",
            // "campaignManagerId",
            "notes",

            "customers.*",

            "billingAdress.*",

            "projectManagers.*",

            "projectManagers.projectManager.*",

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

//#region create
/**
 * Create a new campaign
 * @param campaign The campaign data without an id
 * @returns The id of the created campaign
 */
interface CreateNewCampaignParams {
    campaign: Omit<Campaign.Campaign, "id">;
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
        campaign.customers.map((customer) => customers.create(customer, createdCampaign.id))
    );

    return createdCampaign.id;
}
//#endregion create

//#region get
export async function getCampaign(id: string): Promise<Nullable<Campaign.CampaignMin>> {
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
//#endregion get

//#region list
export async function listCampaigns(): Promise<Campaign.CampaignMin[]> {
    const { data, errors } = await client.models.Campaign.list({
        // ts-expect-error - This is a valid selectionSet
        selectionSet,
    });
    if (errors) {
        console.log({ errors });
        throw new Error(JSON.stringify({ errors }));
    }
    const campaigns: Campaign.CampaignMin[] = validateCampaigns(data);

    return campaigns;
}
//#endregion list

//#region delete
export async function deleteCampaign(
    campaign: PartialWith<Campaign.Campaign, "id" | "customers" | "campaignTimelineEvents">
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
//#endregion delete

//#region Connections
interface ConnectToManagerParams {
    campaignId: string;
    projectManagerId: string;
}
export async function connectToManager({ campaignId, projectManagerId }: ConnectToManagerParams) {
    const { data, errors } = await client.models.ProjectManagerCampaignAssignment.create({
        projectManagerId,
        campaignId,
    });
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }
}

//#endregion

//region Validation
function validateCampaign(rawCampaign: Nullable<RawCampaign>): Nullable<Campaign.CampaignMin> {
    if (!rawCampaign) {
        return null;
    }
    try {
        const customers: Customer.Customer[] = rawCampaign.customers.map((raw) => {
            return {
                id: raw.id,
                company: raw.company ?? "",
                email: raw.email ?? "",
                firstName: raw.firstName ?? "",
                lastName: raw.lastName ?? "",
                phoneNumber: raw.phoneNumber ?? "",
                companyPosition: raw.companyPosition ?? "",
                profileLink: raw.linkedinProfile ?? "",
                notes: raw.notes ?? "",
            } satisfies Customer.Customer;
        });
        const projectManagers: ProjectManagers.ProjectManager[] = rawCampaign.projectManagers.map((raw) => {
            return {
                id: raw.projectManager.id,
                email: raw.projectManager.email,
                firstName: raw.projectManager.firstName,
                lastName: raw.projectManager.lastName,
                phoneNumber: raw.projectManager.phoneNumber ?? undefined,
                notes: raw.projectManager.notes ?? undefined,
            } satisfies ProjectManagers.ProjectManager;
        });
        const dataOut: Campaign.CampaignMin = {
            id: rawCampaign.id,
            notes: rawCampaign.notes,
            customers,
            billingAdress: rawCampaign.billingAdress ?? null,
            budget: rawCampaign.budget ?? null,
            projectManagers,
        };
        return dataOut;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function validateCampaigns(rawCampaigns: RawCampaign[]): Campaign.CampaignMin[] {
    return rawCampaigns.map(validateCampaign).filter((x): x is Campaign.CampaignMin => x !== null);
}
