import { SelectionSet } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

export const selectionSet = [
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
export type RawCampaign = SelectionSet<Schema["Campaign"]["type"], typeof selectionSet>;

export const selectionSetReferences = [
    //
    "id",
    // "campaignManagerId",
    "notes",
    "budget",
    "customers.id",
    "billingAdress.*",
    "projectManagers.projectManager.id",
    "assignedInfluencers.id",
    "timelineEvents.id",
    "timelineEvents.timelineEventType",
] as const;

export type RawCampaignWithReferences = SelectionSet<
    Schema["Campaign"]["type"],
    typeof selectionSetReferences
>;
