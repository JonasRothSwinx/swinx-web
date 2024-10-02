import { Nullable } from "@/app/Definitions/types";
import { Campaigns, Customer, ProjectManager } from "@/app/ServerFunctions/types";
import { RawCampaign, RawCampaignWithReferences } from "./_config";

//region Validation
export const validate = {
    full: {
        one: validateCampaign,
        many: validateCampaigns,
    },
    referential: {
        one: validateCampaignWithReferences,
        many: validateCampaignsWithReferences,
    },
};
async function validateCampaign(
    rawCampaign: Nullable<RawCampaign>,
): Promise<Nullable<Campaigns.Min>> {
    if (!rawCampaign) {
        return null;
    }
    try {
        const customers: Customer[] = rawCampaign.customers.map((raw) => {
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
            } satisfies Customer;
        });
        const projectManagers: ProjectManager[] = rawCampaign.projectManagers.map((raw) => {
            return {
                id: raw.projectManager.id,
                email: raw.projectManager.email,
                firstName: raw.projectManager.firstName,
                lastName: raw.projectManager.lastName,
                phoneNumber: raw.projectManager.phoneNumber ?? undefined,
                notes: raw.projectManager.notes ?? undefined,
                cognitoId: raw.projectManager.cognitoId,
                jobTitle: raw.projectManager.jobTitle,
            } satisfies ProjectManager;
        });
        const dataOut: Campaigns.Min = {
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

async function validateCampaigns(rawCampaigns: RawCampaign[]): Promise<Campaigns.Min[]> {
    return (await Promise.all(rawCampaigns.map(validateCampaign))).filter((x) => x !== null);
}

async function validateCampaignWithReferences(
    rawCampaign: Nullable<RawCampaignWithReferences>,
): Promise<Nullable<Campaigns.Referential>> {
    if (!rawCampaign) {
        console.error("Missing Data");
        return null;
    }
    try {
        const parsedCampaign: Campaigns.Referential = {
            id: rawCampaign.id,
            budget: rawCampaign.budget ?? null,
            notes: rawCampaign.notes ?? null,
            billingAdress: rawCampaign.billingAdress ?? null,
            customerIds: rawCampaign.customers.map((x) => x.id),
            events: rawCampaign.timelineEvents.map((x) => ({
                id: x.id,
                type: x.timelineEventType,
            })),
            assignmentIds: rawCampaign.assignedInfluencers.map((x) => x.id),
            projectManagerIds: rawCampaign.projectManagers.map((x) => x.projectManager.id),
        };
        return parsedCampaign;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function validateCampaignsWithReferences(
    rawCampaigns: Nullable<RawCampaignWithReferences>[],
): Promise<Campaigns.Referential[]> {
    return (await Promise.all(rawCampaigns.map(validateCampaignWithReferences))).filter(
        (x) => x !== null,
    );
}
