"use server";
import { client } from "../_dbclient";

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
