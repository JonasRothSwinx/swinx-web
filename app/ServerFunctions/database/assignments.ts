"use server";

import { timelineEvents } from "../dbInterface";
import Assignment from "../types/assignment";
import client from "./.dbclient";

export async function createAssignment(assignment: Assignment.AssignmentFull, campaignId: string) {
    const { placeholderName: name, budget, isPlaceholder = true } = assignment;
    if (!name) throw new Error("Missing Data");

    const { data, errors } = await client.models.InfluencerAssignment.create({
        placeholderName: name,
        budget,
        campaignAssignedInfluencersId: campaignId,
        isPlaceholder,
    });
    return data.id;
}

export async function deletePlaceholder(assignment: Assignment.AssignmentFull) {
    const { id } = assignment;
    if (!id) throw new Error("Missing Data");

    await Promise.all(
        assignment.timelineEvents.map(async (x) => {
            timelineEvents.delete(x);
        })
    );

    await client.models.InfluencerAssignment.delete({ id });
}
